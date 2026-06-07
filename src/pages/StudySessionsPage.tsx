import { useState } from "react";
import type { StudySession } from "../types";

function StudySessionsPage() {
  const [topic, setTopic] = useState("");
  const [attempted, setAttempted] = useState("");
  const [correct, setCorrect] = useState("");
  const [incorrect, setIncorrect] = useState("");
  const [notes, setNotes] = useState("");

  const [sessions, setSessions] = useState<StudySession[]>([]);

  // Save session and reset form
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic || !attempted || !correct || !incorrect) {
      alert("Please fill all required fields");
      return;
    }

    if (Number(correct) + Number(incorrect) !== Number(attempted)) {
      alert("Correct + Incorrect must equal Attempted");
      return;
    }

    const newSession = {
      topic,
      attempted,
      correct,
      incorrect,
      notes,
    };

    setSessions([...sessions, newSession]);

    setTopic("");
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
          <input
            type="text"
            placeholder="Cardiology"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
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

      {sessions.map((session, index) => (
        <div key={index}>
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
            <strong>Incorrect:</strong> {session.incorrect}
          </p>

          <p>
            <strong>Accuracy:</strong>{" "}
            {Math.round(
              (Number(session.correct) / Number(session.attempted)) * 100,
            )}
            %
          </p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default StudySessionsPage;
