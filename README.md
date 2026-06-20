# AMC AI Coach

**Live:** https://amc-ai-coach.vercel.app

---

## What this is

My partner is preparing for the Australian Medical Council (AMC) MCQ Part 1 exam. She logs every study session — topic, questions attempted, correct/incorrect — and every mistake she makes: question summary, why she got it wrong, the correct concept. The system computes her weak topics, mistake patterns, and performance trends. The AI explains why each topic is weak and what she should do about it.

It started as a way to help her study. It became a focused experiment in how to use LLMs correctly in a data analytics context — specifically, the boundary between what TypeScript should own and what the model should own.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       User Input                        │
│          Study sessions + Mistakes (Supabase)           │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 TypeScript Analytics                    │
│            src/analytics/computeAnalytics.ts            │
│                                                         │
│  getRankedWeakTopics()       → RankedTopic[]            │
│  getMistakeFrequencyByTopic() → MistakeFrequency[]      │
│  getPerformanceDelta()       → number                   │ │
└──────────────────────────┬──────────────────────────────┘
                           │ pre-computed metrics only
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Prompt Functions                     │
│       src/prompts/{dashboardInsight,                    │
│         weakTopicAnalysis, mistakePatternAnalysis,      │
│         recommendations}.ts                             │
│                                                         │
│  Accept: RankedTopic[], MistakeFrequency[], Mistake[]   │
│  Never accept: raw StudySession[]                       │
└──────────────────────────┬──────────────────────────────┘
                           │ structured prompt string
                           ▼
┌─────────────────────────────────────────────────────────┐
│               Supabase Edge Function                    │
│                /functions/v1/ai-coach                   │
│                                                         │
│  OpenAI API key in Supabase secrets — never in bundle   │
│  Returns parsed JSON — no choices[] unwrapping needed   │
└──────────────────────────┬──────────────────────────────┘
                           │ typed AI response
                           ▼
┌─────────────────────────────────────────────────────────┐
│                          UI                             │
│                   AIInsightCard.tsx                     │
│                                                         │
│  Renders computed evidence panel first                  │
│  Then renders AI interpretation below it               │
│  Thumbs up/down per insight → aiFeedback.ts             │
└─────────────────────────────────────────────────────────┘
```

---

## Why not just pass raw data to the LLM?

This was the first design decision, and it shapes everything downstream.

The obvious approach is to dump session records into the prompt and ask GPT to figure out which topics are weakest. The problem:

**Hallucinated calculations.** LLMs are unreliable at arithmetic over arrays of numbers. Asking GPT to average accuracy across 30 sessions and rank topics by performance produces confident-sounding but occasionally wrong answers. The model doesn't distinguish between "I computed this" and "this seems plausible."

**Non-determinism in the wrong place.** Analytics should be deterministic — given the same sessions, you always want the same ranked topics. Putting the calculation inside GPT makes it probabilistic. Temperature 0 helps but doesn't fully solve it, and it doesn't make the logic testable.

**Untestable logic.** If GPT computes the ranking, you can't write a unit test for it. If the analytics are pure TypeScript functions, you can test them with no API calls. `getRankedWeakTopics()` and `getMistakeFrequencyByTopic()` are deterministic, side-effect-free, and trivially testable.

**The boundary this creates:** TypeScript owns all computation. GPT owns only natural-language interpretation of already-computed results. The model is never asked "what is 47% minus 63%?" — it's told "this topic has a 47% average accuracy with a declining trend; explain why that's a problem and what she should do."

This boundary is enforced at the type level. Every AI response interface in `src/types/aiResponses.ts` includes an `evidence` field that maps back to computed values:

```typescript
// DashboardInsightResponse
evidence: {
  topic: AMCTopic;
  accuracy: number; // from getRankedWeakTopics()
  trend: "improving" | "declining" | "stable"; //// computed internally by getRankedWeakTopics()
}

// WeakTopicAnalysisResponse — per weak topic
evidence: {
  accuracy: number; // averageAccuracy from RankedTopic
  mistakeCount: number; // count from MistakeFrequency
  trend: "improving" | "declining" | "stable";
}
```

The UI renders the evidence panel before the AI text, so you can see exactly which numbers the model was working from.

---

## Prompt engineering

Four prompts, each in its own module: `dashboardInsight`, `weakTopicAnalysis`, `mistakePatternAnalysis`, `recommendations`.

Each prompt function accepts typed analytics inputs and returns a plain string. They never accept raw `StudySession[]`. For example, `buildWeakTopicAnalysisPrompt(weakTopics: RankedTopic[], mistakeFrequency: MistakeFrequency[])` receives computed rankings — it has no access to the underlying sessions that produced them.

All prompts instruct the model to return only valid JSON with no preamble or markdown fencing. The system message is kept to one sentence: `"You are an AMC exam study coach. Return only valid JSON."` Most of the structural constraint is in the user prompt, which includes the exact JSON schema the model must conform to.

Responses are validated against TypeScript interfaces at the call site via generic typing on `callOpenAI<T>()`. If the shape doesn't match, the component receives `null` and renders an error state rather than malformed data.

Prompt versioning is tracked in `src/prompts/CHANGELOG.md`. All four prompts are at v1 (June 2026). The changelog exists so prompt changes are auditable — if output quality shifts after an edit, there's a record of what changed and when.

---

## AI feedback loop

`src/services/aiFeedback.ts` records a thumbs up/down for each AI insight generated, tagged by insight type (`weak_topic_analysis`, `mistake_pattern_analysis`, `recommendations`, `dashboard_insight`):

```typescript
interface AIFeedbackEntry {
  insightType: string;
  timestamp: string;
  rating: "helpful" | "not_helpful";
}
```

Entries persist in `localStorage` and aggregate via `getFeedbackSummary()`. Every `AIInsightCard` renders rating buttons after the insight text. After a rating is given, the buttons lock — one rating per insight per session.

The purpose is to make prompt iteration evidence-based rather than impressionistic. Without per-insight ratings, the only way to evaluate a prompt is to read it and guess. With them, you can compare helpfulness across prompt versions and know whether an edit improved things. The storage is lightweight (no backend required), but the pattern matters: treat prompts like code that needs measurement to improve.

---

## API security

**Phase 1 (MVP):** The OpenAI API key was exposed in the browser bundle as `VITE_OPENAI_API_KEY`. This was an accepted tradeoff — the app was used by one person, the key was rate-limited, and moving fast was the priority. Documenting it as a known risk was deliberate; hiding it would have been worse engineering.

**Phase 2 (current):** `src/services/openai.ts` now POSTs to a Supabase Edge Function instead of calling OpenAI directly. The OpenAI key lives in Supabase secrets and never reaches the client bundle. The request is authenticated with `VITE_SUPABASE_ANON_KEY`, which is the public anon key Supabase is designed to expose — it identifies the project but grants only the permissions defined by RLS policies.

```typescript
// callOpenAI() — client sends prompts, never touches the OpenAI key
const response = await fetch(EDGE_FUNCTION_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  },
  body: JSON.stringify({ systemPrompt, userPrompt }),
});
```

Data isolation is handled by Supabase Row Level Security. Every query in `src/services/storage.ts` filters by `user_id` matching the authenticated user. A logged-out user or a user with a different account cannot read another user's sessions or mistakes — this is enforced at the database layer, not just in application code.

---

## Stack

- **React 19**, TypeScript ~6.0, Vite 8, React Router 7
- **Tailwind CSS 4**, Motion 12, Lucide React
- **Supabase** — Postgres, auth, Row Level Security, Edge Functions (Deno)
- **OpenAI GPT** via Supabase Edge Function
- **Vercel** — static hosting

There is no custom backend server. Supabase handles auth, the database, and the AI proxy. The client is a static React SPA.

---

## Phased roadmap

**Phase 1 — built**

- Study session logging (topic, attempted, correct, incorrect, notes)
- Mistake logging (question summary, why wrong, correct concept)
- TypeScript analytics pipeline: weak topic ranking, mistake frequency, performance trend detection
- Three on-demand AI analysis panels: weak topic breakdown, mistake patterns, prioritised recommendations
- Dashboard with AI-generated insight on the most urgent topic
- Per-insight feedback (thumbs up/down) to measure prompt quality
- Vercel deployment

**Phase 2 — built**

- Supabase auth (email/password), replacing anonymous localStorage persistence
- Row Level Security: each user's data isolated at the database layer
- `src/services/storage.ts` persistence abstraction — camelCase TypeScript fields ↔ snake_case Postgres columns
- OpenAI key moved server-side via Supabase Edge Function
- `useStudySessions` and `useMistakes` hooks with loading/error states and `refetch` callbacks
- Prompt versioning via `src/prompts/CHANGELOG.md`

**Phase 3 — planned**

- Study memory: persist past AI insights, track whether suggested actions were followed
- Adaptive planning: weekly session targets that adjust based on trend data
- RAG over AMC syllabus: embed curriculum topics, retrieve relevant context before generating recommendations
- Mistake clustering: embed `whyWrong` and `correctConcept` fields, group semantically similar mistakes across topics to surface gaps that topic-frequency alone misses

---

## Known limitations

**No automated prompt evaluation harness.** Prompt quality is assessed manually by reading outputs and through accumulated feedback ratings. There's no evals framework that catches regressions when a prompt changes. A small set of golden input/output pairs evaluated against a rubric would make iteration much more reliable.

**Trend detection is statistically naive.** The internal trend-detection helper inside `getRankedWeakTopics()` splits sessions into two halves and compares average accuracy. The threshold is a fixed 5-point delta. With fewer than four sessions on a topic, a single outlier flips the trend label. The implementation is honest about this — it returns `"stable"` when there's only one session, and the UI warns when there's only one topic logged — but the underlying method doesn't scale to noisy data.

**Feedback ratings are device-local.** AI helpfulness ratings persist in `localStorage`, not Supabase. They're device-specific, don't survive a browser clear, and can't be aggregated across sessions. This was fine when the app had no auth, but now that users exist, the data should move to the database.

**No streaming.** The Edge Function waits for the full OpenAI response before returning it. Insight cards show a 2–4 second loading skeleton rather than streaming tokens progressively. Straightforward to fix; not prioritised yet.

---

## What I'd build next

**FastAPI backend.** Supabase Edge Functions are convenient but constrained. A FastAPI service gives more control over prompt orchestration, middleware, logging, and testing — and separates the AI layer from the database layer as prompt logic grows in complexity.

**RAG over AMC syllabus.** The current prompts have no domain knowledge beyond GPT's training data. Embedding the AMC curriculum and retrieving relevant topic content before generating recommendations would make suggestions more specific to the actual exam — e.g., surfacing the specific AMC syllabus areas that a weak topic maps to.

**Embeddings for mistake clustering.** Mistakes are currently grouped only by topic label. Two Neurology mistakes could be about completely different mechanisms. Embedding the `whyWrong` and `correctConcept` fields and clustering semantically would surface recurring conceptual gaps that topic-frequency alone misses.

**Prompt evaluation harness.** Fixture inputs with expected output properties, evaluated against actual model responses using a lightweight LLM-as-judge. This makes it safe to iterate prompts without manually re-reading every output after each change.
