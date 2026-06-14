# AMC AI Coach

**Live:** https://amc-ai-coach.vercel.app

An AI-powered study analytics platform built for a doctor preparing for the Australian Medical Council (AMC) MCQ Part 1 exam.

---

## The User Story

My partner is preparing for the AMC MCQ Part 1 exam. She logs her study sessions and mistakes daily. The system computes her weak topics, mistake patterns, and performance trends. The AI explains why each topic is weak and what she should do about it. I iterated the recommendations using real feedback from her actual usage.

This is not a demo. It is a real tool used by a real person preparing for a high-stakes medical exam.

---

## Architecture

Raw Data → Computed Analytics → LLM Interpretation → UI

Every AI insight is generated from pre-computed analytics, not raw session data. The LLM interprets results — it never performs calculations.
src/

├── analytics/

│ └── computeAnalytics.ts ← pure functions, no LLM, testable independently

├── prompts/

│ ├── dashboardInsight.ts

│ ├── weakTopicAnalysis.ts

│ ├── mistakePatternAnalysis.ts

│ ├── recommendations.ts

│ └── CHANGELOG.md ← prompt version history

├── services/

│ ├── openai.ts ← single typed wrapper, JSON mode enforced

│ ├── storage.ts ← persistence abstraction, one-file Supabase swap

│ └── aiFeedback.ts ← feedback logger

├── types/

│ ├── index.ts ← domain types + AMCTopic union

│ └── aiResponses.ts ← typed AI response interfaces

└── pages/

├── DashboardPage.tsx

├── StudySessionsPage.tsx

├── MistakesPage.tsx

└── AICoachPage.tsx

---

## Why Not Pass Raw Data to the LLM?

The obvious approach is sending raw session data to GPT and asking it to find patterns. This fails in production because:

- LLMs hallucinate calculations
- Results are non-deterministic
- You cannot unit test it
- Cost scales with data size

Instead, `computeAnalytics.ts` runs pure TypeScript functions before any API call. GPT receives a structured summary and interprets it. Every number in the AI response is computed in TypeScript first and echoed back as evidence in the UI.

---

## Key Engineering Decisions

**Single storage abstraction**
All localStorage reads and writes go through `storage.ts`. No component touches localStorage directly. In Phase 2, swapping localStorage for Supabase is a single-file change.

**Single typed OpenAI wrapper**
All API calls go through `callOpenAI<T>()`. JSON mode enforced on every call. To switch providers, change two lines in one file.

**Evidence panel on every AI response**
Every AI insight card shows the computed data that triggered it. The user can verify every number. This builds trust and makes the system debuggable.

**User-initiated AI calls**
No OpenAI call happens on page load. Every AI feature requires an explicit Generate button click. Cost is predictable and the AI feels intentional.

**Prompt versioning**
Every prompt change is logged in `src/prompts/CHANGELOG.md` with date and reason. This demonstrates that AI output quality must be measured and iterated.

**AI feedback loop**
Thumbs up/down on every insight. Feedback is stored in localStorage and summarised via `getFeedbackSummary()`. This is the mechanism for prompt iteration — a core AI engineering skill.

---

## API Security

**Phase 1 (current):** The OpenAI API key lives in `VITE_OPENAI_API_KEY` and is visible in the browser bundle. This is a known, accepted tradeoff for a single-user portfolio MVP.

**Phase 2 (planned):** OpenAI calls move to a Supabase Edge Function. The key lives in Supabase secrets. The frontend never touches it directly.
Phase 1: Frontend → OpenAI API (key in browser)

Phase 2: Frontend → Supabase Edge Function → OpenAI API (key in server secrets)

---

## Tech Stack

| Layer       | Technology                       |
| ----------- | -------------------------------- |
| Frontend    | React + TypeScript + Vite        |
| Styling     | Tailwind CSS                     |
| LLM         | OpenAI API — GPT-4o, JSON mode   |
| Persistence | localStorage (Phase 1)           |
| Deployment  | Vercel                           |
| Persistence | Supabase (Phase 2)               |
| API Proxy   | Supabase Edge Function (Phase 2) |

---

## Roadmap

**Phase 1 — Complete**

- Study session and mistake logging
- Computed analytics pipeline
- AI insights with evidence panels
- AI feedback system
- Vercel deployment

**Phase 2 — In Progress**

- Supabase replaces localStorage
- OpenAI calls move to Supabase Edge Function
- Partner begins daily use with real data

**Phase 3 — Planned**

- RAG over AMC syllabus
- Embeddings for mistake clustering
- Performance trend predictions

---

## Known Limitations

- Data is stored in localStorage — clearing the browser wipes all data (fixed in Phase 2)
- API key is exposed in the browser bundle (fixed in Phase 2)
- Desktop only — mobile layout is Phase 2
- No authentication — single user only

---

## What I Would Build Next

- FastAPI backend for server-side analytics
- RAG pipeline over the AMC syllabus for question-specific guidance
- Embeddings to cluster similar mistakes and surface hidden patterns
- Spaced repetition system driven by mistake frequency data
