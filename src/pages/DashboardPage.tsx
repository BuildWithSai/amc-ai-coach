import { getSessions, getMistakes } from "../services/storage";
import {
  getRankedWeakTopics,
  getMistakeFrequencyByTopic,
} from "../analytics/computeAnalytics";

function DashboardPage() {
  const sessions = getSessions();
  const mistakes = getMistakes();

  const weakTopics = getRankedWeakTopics(sessions);
  const mistakeFrequency = getMistakeFrequencyByTopic(mistakes);

  return (
    <div>
      <h1>Dashboard</h1>

      {sessions.length === 0 ? (
        <p>Start logging study sessions to see your analytics.</p>
      ) : (
        <>
          <h2>Weak Topics</h2>
          {weakTopics.map((t) => (
            <div key={t.topic}>
              <p>
                {t.topic} — {t.averageAccuracy}% accuracy — {t.trend}
              </p>
            </div>
          ))}

          <h2>Top Mistakes</h2>
          {mistakeFrequency.length === 0 ? (
            <p>No mistakes logged yet.</p>
          ) : (
            mistakeFrequency.slice(0, 3).map((m) => (
              <div key={m.topic}>
                <p>
                  {m.topic} — {m.count} mistakes
                </p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default DashboardPage;
