import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Mistake, AMCTopic } from "../types";
import { getMistakes, saveMistake } from "../services/storage";

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

function MistakesPage() {
  const [topic, setTopic] = useState<AMCTopic>("Cardiology");
  const [questionSummary, setQuestionSummary] = useState("");
  const [whyWrong, setWhyWrong] = useState("");
  const [correctConcept, setCorrectConcept] = useState("");

  // Load from storage on first render — survives page refresh
  const [mistakes, setMistakes] = useState<Mistake[]>(getMistakes);

  const handleSaveMistake = (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionSummary || !whyWrong || !correctConcept) {
      alert("Please fill all required fields");
      return;
    }

    const newMistake: Mistake = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      topic,
      questionSummary,
      whyWrong,
      correctConcept,
    };

    saveMistake(newMistake);
    setMistakes(getMistakes());

    setQuestionSummary("");
    setWhyWrong("");
    setCorrectConcept("");
  };

  return (
    <div>
      <h1>Mistakes</h1>
      <h2>Add Mistake</h2>

      <form onSubmit={handleSaveMistake}>
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
          <label>Question Summary</label>
          <br />
          <textarea
            rows={3}
            value={questionSummary}
            onChange={(e) => setQuestionSummary(e.target.value)}
          />
        </div>
        <br />

        <div>
          <label>Why I Got It Wrong</label>
          <br />
          <textarea
            rows={3}
            value={whyWrong}
            onChange={(e) => setWhyWrong(e.target.value)}
          />
        </div>
        <br />

        <div>
          <label>Correct Concept</label>
          <br />
          <textarea
            rows={3}
            value={correctConcept}
            onChange={(e) => setCorrectConcept(e.target.value)}
          />
        </div>
        <br />

        <button type="submit">Save Mistake</button>
      </form>

      <h2>Saved Mistakes</h2>
      {mistakes.map((mistake) => (
        <div key={mistake.id}>
          <p>
            <strong>Topic:</strong> {mistake.topic}
          </p>
          <p>
            <strong>Question:</strong> {mistake.questionSummary}
          </p>
          <p>
            <strong>Why Wrong:</strong> {mistake.whyWrong}
          </p>
          <p>
            <strong>Correct Concept:</strong> {mistake.correctConcept}
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default MistakesPage;
