# Data Model

## Topic

Purpose:

Store AMC exam topics.

Fields:

- id
- name
- category

Examples:

- Cardiology
- Respiratory
- Neurology

---

## Study Session

Purpose:

Store study activity.

Fields:

- id
- date
- topic_id
- questions_attempted
- correct_answers
- incorrect_answers
- notes

---

## Mistake

Purpose:

Track learning mistakes.

Fields:

- id
- topic_id
- description
- date
- status

---

## AI Recommendation

Purpose:

Store AI-generated recommendations.

Fields:

- id
- weak_topic
- recommendation
- created_at