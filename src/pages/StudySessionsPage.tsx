import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { StudySession, AMCTopic } from "../types";
import { getSessions, saveSession } from "../services/storage";

// AMC topic list — drives the dropdown. Single source of truth.
const AMC_TOPICS: AMCTopic[] = [
  "Cardiology",
  "Respiratory Medicine",
  "Gastroenterology",
  "Neurology",
  "Obstetrics & Gynaecology",
  "Paediatrics",
  "Psychiatry",
  "Surgery",
  "Pharmacology",
  "Endocrinology",
  "Infectious Diseases",
  "Renal Medicine",
  "Musculoskeletal",
  "Dermatology",
  "Haematology",
];

function StudySessionsPage() {
  const [topic, setTopic] = useState<AMCTopic>("Cardiology");
  const [attempted, setAttempted] = useState("");
  const [correct, setCorrect] = useState("");
  const [incorrect, setIncorrect] = useState("");
  const [notes, setNotes] = useState("");

  // Load from storage, not local state — survives page refresh
  const [sessions, setSessions] = useState<StudySession[]>(getSessions);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(correct) + Number(incorrect) !== Number(attempted)) {
      alert("Correct + Incorrect must equal Attempted");
      return;
    }

    const newSession: StudySession = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      topic,
      attempted: Number(attempted),
      correct: Number(correct),
      incorrect: Number(incorrect),
      notes,
    };

    saveSession(newSession);
    setSessions(getSessions());

    setAttempted("");
    setCorrect("");
    setIncorrect("");
    setNotes("");
  };

  return (
    <div>
      <h1>Study Sessions</h1>
      <h2>Add Study Session</h2>

      <form onSubmit={handleSave}>
        <div>
          <label>Topic</label>
          <br />
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value as AMCTopic)}
          >
            {AMC_TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <br />

        <div>
          <label>Questions Attempted</label>
          <br />
          <input
            type="number"
            value={attempted}
            onChange={(e) => setAttempted(e.target.value)}
          />
        </div>
        <br />

        <div>
          <label>Correct Answers</label>
          <br />
          <input
            type="number"
            value={correct}
            onChange={(e) => setCorrect(e.target.value)}
          />
        </div>
        <br />

        <div>
          <label>Incorrect Answers</label>
          <br />
          <input
            type="number"
            value={incorrect}
            onChange={(e) => setIncorrect(e.target.value)}
          />
        </div>
        <br />

        <div>
          <label>Notes</label>
          <br />
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <br />

        <button type="submit">Save Session</button>
      </form>

      <h2>Saved Sessions</h2>
      {sessions.map((session) => (
        <div key={session.id}>
          <p>
            <strong>Topic:</strong> {session.topic}
          </p>
          <p>
            <strong>Attempted:</strong> {session.attempted}
          </p>
          <p>
            <strong>Correct:</strong> {session.correct}
          </p>
          <p>
            <strong>Accuracy:</strong>{" "}
            {Math.round((session.correct / session.attempted) * 100)}%
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default StudySessionsPage;
