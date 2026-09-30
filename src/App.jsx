import { useState } from "react";
import "./App.css";

const initialQuests = [
  {
    id: 1,
    title: "Defeat the Dragon",
    category: "Combat",
    difficulty: "Hard",
    status: "Active",
    xp: 500,
  },
  {
    id: 2,
    title: "Find the Lost Sword",
    category: "Adventure",
    difficulty: "Medium",
    status: "Completed",
    xp: 300,
  },
  {
    id: 3,
    title: "Explore Dark Forest",
    category: "Exploration",
    difficulty: "Easy",
    status: "Active",
    xp: 150,
  },
  {
    id: 4,
    title: "Collect Ancient Runes",
    category: "Collection",
    difficulty: "Medium",
    status: "Active",
    xp: 250,
  },
];

function Header({ total, completed }) {
  return (
    <header className="header">
      <div>
        <p className="eyebrow">ADVENTURE CONTROL CENTER</p>
        <h1>Quest Dashboard</h1>
        <p className="subtitle">
          Manage your quests, track progress and explore your adventure.
        </p>
      </div>

      <div className="stats">
        <div className="stat">
          <span>Total</span>
          <strong>{total}</strong>
        </div>

        <div className="stat">
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>
      </div>
    </header>
  );
}

function QuestCard({ quest, onRemove, onStatusChange }) {
  const [progress, setProgress] = useState(0);
  const [favorite, setFavorite] = useState(false);

  console.log(`QuestCard rendered: ${quest.title}`);

  const increaseProgress = () => {
    setProgress((current) => Math.min(current + 10, 100));
  };

  const resetLocalState = () => {
    setProgress(0);
    setFavorite(false);
  };

  return (
    <article className="quest-card">
      <div className="quest-top">
        <div>
          <span className={`badge ${quest.difficulty.toLowerCase()}`}>
            {quest.difficulty}
          </span>

          <span className="category">{quest.category}</span>
        </div>

        <button
          className={`favorite ${favorite ? "active" : ""}`}
          onClick={() => setFavorite(!favorite)}
        >
          {favorite ? "★" : "☆"}
        </button>
      </div>

      <h2>{quest.title}</h2>

      <div className="quest-info">
        <span>XP: {quest.xp}</span>

        <select
          value={quest.status}
          onChange={(e) => onStatusChange(quest.id, e.target.value)}
        >
          <option>Active</option>
          <option>Completed</option>
          <option>Paused</option>
        </select>
      </div>

      <div className="progress-section">
        <div className="progress-label">
          <span>Local progress</span>
          <strong>{progress}%</strong>
        </div>

        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="actions">
        <button onClick={increaseProgress} disabled={progress === 100}>
          +10% Progress
        </button>

        <button onClick={resetLocalState} className="secondary">
          Reset Local State
        </button>

        <button onClick={() => onRemove(quest.id)} className="delete">
          Delete
        </button>
      </div>
    </article>
  );
}

function QuestList({
  quests,
  onRemove,
  onStatusChange,
  reverse,
  setReverse,
}) {
  const displayedQuests = reverse ? [...quests].reverse() : quests;

  return (
    <section>
      <div className="list-header">
        <div>
          <h2>Available Quests</h2>
          <p>{quests.length} quests found</p>
        </div>

        <button
          className="reverse-button"
          onClick={() => setReverse(!reverse)}
        >
          {reverse ? "Normal Order" : "Reverse Order"}
        </button>
      </div>

      {quests.length === 0 ? (
        <div className="empty">
          <h3>No quests found</h3>
          <p>Try changing your filter or add a new quest.</p>
        </div>
      ) : (
        <div className="quest-grid">
          {displayedQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onRemove={onRemove}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function App() {
  const [quests, setQuests] = useState(initialQuests);
  const [filter, setFilter] = useState("All");
  const [reverse, setReverse] = useState(false);
  const [newQuest, setNewQuest] = useState("");
  const [resetVersion, setResetVersion] = useState(0);

  const addQuest = () => {
    if (!newQuest.trim()) return;

    const quest = {
      id: Date.now(),
      title: newQuest,
      category: "Custom",
      difficulty: "Easy",
      status: "Active",
      xp: 100,
    };

    setQuests((current) => [...current, quest]);
    setNewQuest("");
  };

  const removeQuest = (id) => {
    setQuests((current) => current.filter((quest) => quest.id !== id));
  };

  const changeStatus = (id, status) => {
    setQuests((current) =>
      current.map((quest) =>
        quest.id === id ? { ...quest, status } : quest
      )
    );
  };

  const filteredQuests =
    filter === "All"
      ? quests
      : quests.filter((quest) => quest.status === filter);

  const completedCount = quests.filter(
    (quest) => quest.status === "Completed"
  ).length;

  return (
    <div className="app">
      <Header total={quests.length} completed={completedCount} />

      <main>
        <section className="control-panel">
          <div className="add-section">
            <input
              type="text"
              placeholder="Enter a new quest..."
              value={newQuest}
              onChange={(e) => setNewQuest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addQuest();
              }}
            />

            <button onClick={addQuest}>+ Add Quest</button>
          </div>

          <div className="filters">
            {["All", "Active", "Completed", "Paused"].map((item) => (
              <button
                key={item}
                className={filter === item ? "selected" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}

            <button
              className="reset-all"
              onClick={() => setResetVersion(resetVersion + 1)}
            >
              Reset All
            </button>
          </div>
        </section>

        <div key={resetVersion}>
          <QuestList
            quests={filteredQuests}
            onRemove={removeQuest}
            onStatusChange={changeStatus}
            reverse={reverse}
            setReverse={setReverse}
          />
        </div>
      </main>

      <footer>
        <p>Quest Dashboard • React Rendering & State Practice</p>
      </footer>
    </div>
  );
}

export default App;