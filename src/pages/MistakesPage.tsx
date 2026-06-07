import { useState } from "react";
import type { Mistake } from "../types";

function MistakesPage() {
  const [mistakeTopic, setMistakeTopic] = useState("");
  const [questionSummary, setQuestionSummary] = useState("");
  const [whyWrong, setWhyWrong] = useState("");
  const [correctConcept, setCorrectConcept] = useState("");

  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  // Save mistake and reset form
  const handleSaveMistake = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mistakeTopic || !questionSummary || !whyWrong || !correctConcept) {
      alert("Please fill all required fields");
      return;
    }

    const newMistake = {
      topic: mistakeTopic,
      questionSummary,
      whyWrong,
      correctConcept,
    };

    setMistakes([...mistakes, newMistake]);

    setMistakeTopic("");
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
          <input
            type="text"
            value={mistakeTopic}
            onChange={(e) => setMistakeTopic(e.target.value)}
          />
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

      {mistakes.map((mistake, index) => (
        <div key={index}>
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
