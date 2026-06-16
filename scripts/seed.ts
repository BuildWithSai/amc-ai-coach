// Run once with: npx tsx scripts/seed.ts — delete after seeding.
//
// NOTE: src/services/supabase.ts uses import.meta.env (Vite-specific) which is
// unavailable in Node/tsx context, so we create the client directly here instead.

import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — run with: npx tsx --env-file=.env scripts/seed.ts')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const USER_ID = "9b7629a0-2395-4fdb-a36e-c89431e5bc25"

// Returns a date string N days before today (2026-06-16)
function daysAgo(n: number): string {
  const d = new Date('2026-06-16T00:00:00.000Z')
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

// Returns a random integer in [min, max]
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Computes correct count from attempted and a target accuracy (0–1)
function correctFromAccuracy(attempted: number, accuracy: number): number {
  return Math.round(attempted * accuracy)
}

// ─── Study Sessions ───────────────────────────────────────────────────────────
//
// 30 sessions spread across the last 60 days.
// Accuracy trends encoded as a list of [daysAgo, targetAccuracy] pairs per topic.

type SessionSpec = {
  topic: string
  entries: Array<{ daysAgo: number; accuracy: number; notes?: string }>
}

const sessionSpecs: SessionSpec[] = [
  {
    topic: 'Cardiology',
    entries: [
      { daysAgo: 58, accuracy: 0.60, notes: 'Reviewed ACS guidelines, felt confident' },
      { daysAgo: 48, accuracy: 0.57 },
      { daysAgo: 35, accuracy: 0.54, notes: 'Heart failure classification still confusing' },
      { daysAgo: 20, accuracy: 0.50 },
      { daysAgo: 6,  accuracy: 0.46, notes: 'Arrhythmia interpretation very weak — need more practice' },
    ],
  },
  {
    topic: 'Pharmacology',
    entries: [
      { daysAgo: 55, accuracy: 0.67 },
      { daysAgo: 40, accuracy: 0.64, notes: 'Drug interactions still catching me out' },
      { daysAgo: 25, accuracy: 0.68 },
      { daysAgo: 10, accuracy: 0.65, notes: 'Antibiotics dosing adjusted to weight — reviewed' },
    ],
  },
  {
    topic: 'Neurology',
    entries: [
      { daysAgo: 57, accuracy: 0.55, notes: 'Stroke syndromes — territory localisation very hard' },
      { daysAgo: 44, accuracy: 0.60 },
      { daysAgo: 30, accuracy: 0.67, notes: 'CN palsies starting to click' },
      { daysAgo: 12, accuracy: 0.74, notes: 'Reviewed epilepsy classification — much clearer now' },
    ],
  },
  {
    topic: 'Gastroenterology',
    entries: [
      { daysAgo: 53, accuracy: 0.68 },
      { daysAgo: 38, accuracy: 0.72, notes: 'IBD vs IBS differentials are solid' },
      { daysAgo: 22, accuracy: 0.69 },
      { daysAgo: 8,  accuracy: 0.71 },
    ],
  },
  {
    topic: 'Respiratory Medicine',
    entries: [
      { daysAgo: 59, accuracy: 0.60, notes: 'ABG interpretation from scratch — slow going' },
      { daysAgo: 45, accuracy: 0.65 },
      { daysAgo: 31, accuracy: 0.70, notes: 'COPD vs asthma management divergence memorised' },
      { daysAgo: 14, accuracy: 0.78, notes: 'PE diagnosis algorithm solid — CXR findings clicking' },
    ],
  },
  {
    topic: 'Endocrinology',
    entries: [
      { daysAgo: 56, accuracy: 0.64 },
      { daysAgo: 46, accuracy: 0.61, notes: 'Thyroid function tests keep tripping me up' },
      { daysAgo: 33, accuracy: 0.57 },
      { daysAgo: 18, accuracy: 0.53, notes: 'Adrenal insufficiency vs phaeochromocytoma differentiation weak' },
      { daysAgo: 4,  accuracy: 0.50, notes: 'DKA management — fluid and insulin rates still uncertain' },
    ],
  },
  {
    topic: 'Paediatrics',
    entries: [
      { daysAgo: 52, accuracy: 0.73 },
      { daysAgo: 37, accuracy: 0.76, notes: 'Development milestones chart reviewed — confident' },
      { daysAgo: 21, accuracy: 0.74 },
      { daysAgo: 7,  accuracy: 0.77, notes: 'Neonatal jaundice management guidelines solid' },
    ],
  },
]

const sessions = sessionSpecs.flatMap(({ topic, entries }) =>
  entries.map(({ daysAgo: da, accuracy, notes }) => {
    const attempted = randInt(10, 20)
    const correct = correctFromAccuracy(attempted, accuracy)
    const incorrect = attempted - correct
    return {
      id: uuidv4(),
      topic,
      attempted,
      correct,
      incorrect,
      notes: notes ?? null,
      created_at: daysAgo(da),
      user_id: USER_ID,
    }
  })
)

// ─── Mistakes ─────────────────────────────────────────────────────────────────

const mistakes = [
  // Cardiology
  {
    topic: 'Cardiology',
    question_summary: '55yo male with crushing chest pain and ST elevation in V1–V4. Chose NSTEMI management pathway.',
    why_wrong: 'ST elevation in contiguous leads = STEMI regardless of troponin; selected conservative NSTEMI pathway.',
    correct_concept: 'STEMI diagnosis is ECG-based — ST elevation ≥1 mm in 2+ contiguous leads mandates immediate PCI or thrombolysis within door-to-balloon time targets.',
    created_at: daysAgo(6),
  },
  {
    topic: 'Cardiology',
    question_summary: '70yo with syncope and complete heart block on ECG. Chose observation and temporary pacing.',
    why_wrong: 'Failed to recognise acquired complete heart block as a Class I indication for permanent pacemaker.',
    correct_concept: 'Symptomatic acquired complete heart block is a Class I indication for permanent pacemaker insertion regardless of reversible cause workup.',
    created_at: daysAgo(20),
  },
  {
    topic: 'Cardiology',
    question_summary: '65yo with dilated cardiomyopathy, EF 30%, on ramipril. Added spironolactone — chose to monitor potassium at 4 weeks.',
    why_wrong: 'Monitoring interval too late; missed the 1-week renal/electrolyte recheck required when adding an MRA to ACE inhibitor.',
    correct_concept: 'When adding spironolactone to ACE inhibitor or ARB in heart failure, recheck U&E at 1 week due to risk of life-threatening hyperkalaemia.',
    created_at: daysAgo(48),
  },
  // Pharmacology
  {
    topic: 'Pharmacology',
    question_summary: 'Prescribed ACE inhibitor to a 28yo woman in her 14th week of pregnancy for chronic hypertension.',
    why_wrong: 'Missed that ACE inhibitors are contraindicated from the second trimester onward (fetotoxic — renal tubular dysgenesis).',
    correct_concept: 'ACE inhibitors and ARBs are absolutely contraindicated in 2nd and 3rd trimester. Use methyldopa, labetalol, or nifedipine for hypertension in pregnancy.',
    created_at: daysAgo(40),
  },
  {
    topic: 'Pharmacology',
    question_summary: 'Continued metformin in a 72yo with Type 2 diabetes whose eGFR fell to 24 mL/min/1.73m².',
    why_wrong: 'Did not flag the eGFR threshold — metformin should be ceased below eGFR 30 to avoid lactic acidosis accumulation.',
    correct_concept: 'Metformin should be withheld when eGFR <30. Risk of lactic acidosis increases with renal impairment as metformin accumulates.',
    created_at: daysAgo(25),
  },
  {
    topic: 'Pharmacology',
    question_summary: 'Patient on warfarin started fluconazole for oral candidiasis — no INR adjustment or dose review recommended.',
    why_wrong: 'Forgot that fluconazole is a potent CYP2C9 inhibitor, markedly increasing warfarin effect and bleeding risk.',
    correct_concept: 'Fluconazole inhibits CYP2C9 and increases warfarin levels significantly. Warfarin dose must be reduced by ~50% and INR monitored closely.',
    created_at: daysAgo(55),
  },
  // Neurology
  {
    topic: 'Neurology',
    question_summary: '44yo with sudden "thunderclap" headache, worst-ever. CT brain normal — chose reassurance and discharge.',
    why_wrong: 'CT negative does not exclude subarachnoid haemorrhage within 6–12 hours; failed to proceed to LP.',
    correct_concept: 'If CT is negative within 6 hours of thunderclap headache onset, sensitivity is ~98% — but LP is still required if clinical suspicion is high or CT performed outside that window.',
    created_at: daysAgo(57),
  },
  {
    topic: 'Neurology',
    question_summary: 'Patient with right arm and face weakness, slurred speech for 2 hours, then resolved. Chose outpatient neurology referral in 2 weeks.',
    why_wrong: 'Failed to recognise TIA as a medical emergency requiring same-day assessment; ABCD² score predicts high stroke risk.',
    correct_concept: 'TIA carries a 10–15% 90-day stroke risk (50% in first 48 hours). Same-day assessment, brain imaging, and antiplatelet therapy are required — urgent, not routine, referral.',
    created_at: daysAgo(44),
  },
  {
    topic: 'Neurology',
    question_summary: 'Lumbar puncture results: xanthochromia present, elevated protein, normal glucose. Chose viral meningitis as diagnosis.',
    why_wrong: 'Xanthochromia indicates blood breakdown products — this is subarachnoid haemorrhage, not viral meningitis (which does not cause xanthochromia).',
    correct_concept: 'Xanthochromia on LP = haem degradation products from subarachnoid haemorrhage. Viral meningitis presents with turbid CSF, pleocytosis, normal glucose, and no xanthochromia.',
    created_at: daysAgo(30),
  },
  // Gastroenterology
  {
    topic: 'Gastroenterology',
    question_summary: '35yo with bloody diarrhoea, abdominal cramping, weight loss, and skip lesions on colonoscopy. Chose ulcerative colitis.',
    why_wrong: 'Skip lesions, transmural inflammation, and rectal sparing are features of Crohn\'s disease, not UC (which is continuous from rectum).',
    correct_concept: 'Crohn\'s disease: discontinuous/skip lesions, transmural, affects any part of GI tract, rectal sparing common. UC: continuous, mucosal only, starts at rectum.',
    created_at: daysAgo(38),
  },
  {
    topic: 'Gastroenterology',
    question_summary: '58yo with jaundice, pale stools, dark urine, and painless weight loss. Ordered USS abdomen and chose to await results before further workup.',
    why_wrong: 'Painless obstructive jaundice with weight loss requires urgent CT and CA 19-9 — high suspicion for pancreatic malignancy.',
    correct_concept: 'Courvoisier\'s sign: painless jaundice + palpable gallbladder = pancreatic head tumour until proven otherwise. Urgent CT pancreas protocol and surgical referral.',
    created_at: daysAgo(53),
  },
  // Respiratory Medicine
  {
    topic: 'Respiratory Medicine',
    question_summary: 'ABG: pH 7.32, pCO₂ 28, HCO₃ 13. Chose primary respiratory alkalosis with metabolic compensation.',
    why_wrong: 'pH is acidotic (< 7.35), so primary disorder is acidosis; low HCO₃ is primary metabolic acidosis, low pCO₂ is respiratory compensation.',
    correct_concept: 'Always determine primary disorder from pH first. pH 7.32 = acidosis. Low HCO₃ = primary metabolic acidosis. Low pCO₂ = appropriate respiratory compensation.',
    created_at: daysAgo(59),
  },
  {
    topic: 'Respiratory Medicine',
    question_summary: '68yo COPD patient in respiratory failure — gave O₂ at 10 L/min via NRB mask to target SpO₂ 98–100%.',
    why_wrong: 'High-flow O₂ in COPD can suppress hypoxic drive and worsen CO₂ retention (type 2 respiratory failure).',
    correct_concept: 'Target SpO₂ 88–92% in COPD to avoid suppressing hypoxic respiratory drive. Use controlled O₂ (28% Venturi); monitor ABG closely.',
    created_at: daysAgo(45),
  },
  // Endocrinology
  {
    topic: 'Endocrinology',
    question_summary: 'TSH low, free T4 high, patient with palpitations and weight loss. Chose Graves\' disease without checking TRAb or doing thyroid scan.',
    why_wrong: 'Chose empirical carbimazole without confirming aetiology — toxic multinodular goitre and thyroiditis are also causes of hyperthyroidism and require different management.',
    correct_concept: 'Differentiate causes of hyperthyroidism: Graves\' (diffuse uptake, TRAb+), toxic MNG (heterogeneous uptake), thyroiditis (low uptake). Aetiology determines treatment: antithyroid drugs vs radioiodine vs surgery.',
    created_at: daysAgo(4),
  },
  {
    topic: 'Endocrinology',
    question_summary: 'Patient with hypertension, hypokalaemia, and metabolic alkalosis. Selected essential hypertension with diuretic-induced hypokalaemia without investigating further.',
    why_wrong: 'Triad of hypertension, hypokalaemia, and metabolic alkalosis should prompt investigation for primary hyperaldosteronism (Conn\'s syndrome).',
    correct_concept: 'Primary hyperaldosteronism: hypertension + unprovoked hypokalaemia + metabolic alkalosis. Investigate with plasma aldosterone:renin ratio. CT adrenals then adrenal vein sampling.',
    created_at: daysAgo(18),
  },
  {
    topic: 'Endocrinology',
    question_summary: 'DKA patient: started insulin immediately on arrival before IV fluids were running.',
    why_wrong: 'Insulin before adequate fluid resuscitation risks worsening hypotension and electrolyte shifts (hypokalaemia); fluids come first.',
    correct_concept: 'DKA management sequence: IV fluids first (0.9% NaCl), correct potassium to >3.5 mmol/L, THEN commence insulin infusion. Insulin drives K⁺ intracellularly — hypokalaemia before insulin is dangerous.',
    created_at: daysAgo(33),
  },
  // Paediatrics
  {
    topic: 'Paediatrics',
    question_summary: '18-month-old not yet walking. Chose to refer immediately to paediatric neurology.',
    why_wrong: 'Walking by 18 months is within normal limits — the upper limit is 18 months; some normal children walk at 17–18 months.',
    correct_concept: 'Gross motor milestone: walking independently expected by 15 months, upper limit of normal is 18 months. Refer only if not walking by 18 months AND other milestones are delayed or neurology signs present.',
    created_at: daysAgo(7),
  },
  {
    topic: 'Paediatrics',
    question_summary: '3-week-old with projectile vomiting after every feed, hungry after vomiting, palpable olive mass. Chose pyloric atresia.',
    why_wrong: 'Pyloric atresia is a neonatal diagnosis (presents at birth with bilious vomiting); this history and age is pyloric stenosis (non-bilious, 2–6 weeks).',
    correct_concept: 'Hypertrophic pyloric stenosis: firstborn males, 2–6 weeks, non-bilious projectile vomiting, hungry after vomiting, palpable olive. Confirmed by USS. Treat with Ramstedt pyloromyotomy.',
    created_at: daysAgo(21),
  },
  {
    topic: 'Paediatrics',
    question_summary: '6yo with fever, sore throat, tonsillar exudate, and cervical lymphadenopathy. Prescribed amoxicillin empirically.',
    why_wrong: 'If EBV (glandular fever) is the cause, amoxicillin will cause a widespread maculopapular rash — CENTOR criteria and monospot test should be considered first.',
    correct_concept: 'In children with pharyngitis and lymphadenopathy, consider EBV before prescribing amoxicillin. Perform monospot or EBV serology. If EBV: supportive care only; amoxicillin/ampicillin causes drug rash in ~90% of EBV cases.',
    created_at: daysAgo(37),
  },
  {
    topic: 'Paediatrics',
    question_summary: '2yo with inspiratory stridor, barking cough, worse at night, low-grade fever. Chose admission and IV antibiotics for epiglottitis.',
    why_wrong: 'Clinical picture is croup (laryngotracheobronchitis), not epiglottitis — different age, gradual onset, characteristic barking cough; epiglottitis causes drooling and tripod posture.',
    correct_concept: 'Croup: 6 months–3 years, barking cough, inspiratory stridor, coryzal prodrome, worse at night. Treat with oral dexamethasone. Epiglottitis: older, abrupt onset, drooling, no cough, toxic-looking — treat as airway emergency.',
    created_at: daysAgo(52),
  },
]

const mistakeRows = mistakes.map((m) => ({
  id: uuidv4(),
  user_id: USER_ID,
  ...m,
}))

// ─── Insert ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log(`Inserting ${sessions.length} study sessions…`)
  const { error: sessErr } = await supabase.from('study_sessions').insert(sessions)
  if (sessErr) {
    console.error('Failed to insert sessions:', sessErr.message)
    process.exit(1)
  }
  console.log(`✓ ${sessions.length} study sessions inserted`)

  console.log(`Inserting ${mistakeRows.length} mistakes…`)
  const { error: mistErr } = await supabase.from('mistakes').insert(mistakeRows)
  if (mistErr) {
    console.error('Failed to insert mistakes:', mistErr.message)
    process.exit(1)
  }
  console.log(`✓ ${mistakeRows.length} mistakes inserted`)

  console.log('\nSeeding complete.')
}

seed()
