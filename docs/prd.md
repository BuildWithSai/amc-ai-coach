# AMC AI Coach

## Product Vision

AMC AI Coach is an AI-powered study companion designed to help AMC MCQ Part 1 aspirants track study sessions, identify weak topics, record mistakes, and receive personalized study recommendations.

## Problem Statement

AMC candidates spend months preparing for the exam.

Many candidates:

- Repeat the same mistakes
- Struggle to identify weak topics
- Have no structured way to track study progress
- Do not know what to study next
- Lack personalized feedback based on their performance

Existing solutions primarily focus on question banks rather than learning analytics and personalized guidance.

## Target User

Primary User:

- Doctors and medical graduates preparing for AMC MCQ Part 1

User Characteristics:

- Studies independently
- Attempts practice questions regularly
- Uses multiple study resources
- Wants visibility into strengths and weaknesses
- Wants guidance on what to study next

## Product Goal

Help AMC candidates answer one important question:

"What should I study next based on my recent performance?"

The product should provide clear visibility into study progress and generate personalized recommendations using AI.

## MVP Features
### Feature 1 - Study Session Tracking

Users can record:

- Date
- Topic
- Questions Attempted
- Correct Answers
- Incorrect Answers
- Notes

Purpose:

Build a history of learning activity.

---

### Feature 2 - Mistake Tracker

Users can record:

- Topic
- Mistake Description
- Date
- Status (Resolved / Unresolved)

Purpose:

Help users avoid repeating mistakes.

---

### Feature 3 - AI Study Coach

The AI Coach analyzes:

- Study sessions
- Mistakes
- Topic performance

The AI generates:

- Weak-topic analysis
- Personalized recommendations
- Suggested next study actions

Purpose:

Provide personalized learning guidance.

## Success Metrics
The MVP is successful if a user can:

1. Record a study session
2. Record a mistake
3. View study statistics
4. Receive an AI recommendation

within five minutes of opening the application.

## Out of Scope
The following are intentionally excluded from the MVP:

- Authentication
- Multi-user support
- Payments
- Question bank
- PDF uploads
- Notes uploads
- RAG
- Embeddings
- Vector databases
- Agents
- Notifications
- Mobile application

These features may be added in future phases.

## Future Roadmap
### Phase 2

- Topic Scoring
- Learning History
- Progress Analytics
- Study Streaks

### Phase 3

- PDF Uploads
- Notes Uploads
- RAG
- Semantic Search

### Phase 4

- Study Planner Agent
- Revision Agent
- Goal Tracking

## Technical Architecture
## Frontend

- React
- TypeScript
- Tailwind CSS

## Backend

- Python
- FastAPI

## Database

- SQLite (MVP)

## AI

- OpenAI API

## Deployment

- Vercel
- Railway

## Elevator Pitch
AMC AI Coach is an AI-powered learning companion for AMC MCQ Part 1 aspirants that helps users track study sessions, record mistakes, identify weak topics, and receive personalized study recommendations based on their performance history.
