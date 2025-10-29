import * as React from "react";

type SavedMessage = {
  id: number;
  content: string;
  emotion: string;
  color: string;
  timestamp: string;
  pinned?: boolean;
};

const STORAGE_KEY = "mooddrop_messages";

export default function MyDropsPage() {
  const [drops, setDrops] = React.useState<SavedMessage[]>([]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setDrops(JSON.parse(stored));
  }, []);

  const saveDrops = (updated: SavedMessage[]) => {
    setDrops(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handlePin = (id: number) => {
    const updated = drops.map((d) =>
      d.id === id ? { ...d, pinned: !d.pinned } : d,
    );
    saveDrops(updated);
  };

  const handleDelete = (id: number) => {
    const updated = drops.filter((d) => d.id !== id);
    const el = document.getElementById("drop-" + id);
    if (el) {
      el.classList.add("animate-fade-up");
      setTimeout(() => saveDrops(updated), 400);
    } else {
      saveDrops(updated);
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all drops?")) {
      localStorage.removeItem(STORAGE_KEY);
      setDrops([]);
    }
  };

  const pinned = drops.filter((d) => d.pinned);
  const unpinned = drops.filter((d) => !d.pinned);

  const moodSummary = drops.reduce(
    (acc, d) => {
      acc[d.emotion] = (acc[d.emotion] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center">
      <h1 className="text-2xl font-semibold mb-4">💧 Your Drops</h1>

      {drops.length > 0 ? (
        <>
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              You have dropped {drops.length} moods —{" "}
              {Object.entries(moodSummary)
                .map(([m, count]) => `${count} ${m}`)
                .join(", ")}
              .
            </p>
          </div>

          {[...pinned, ...unpinned].map((drop) => (
            <div
              key={drop.id}
              id={"drop-" + drop.id}
              className="relative border rounded-2xl p-4 mb-3 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{ backgroundColor: drop.color }}
                  ></span>
                  <span className="font-medium">{drop.emotion}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(drop.timestamp).toLocaleString()}
                </div>
              </div>

              <p className="text-gray-800 mt-2 text-left">{drop.content}</p>

              <div className="flex justify-end gap-4 mt-3 text-sm">
                <button
                  onClick={() => handlePin(drop.id)}
                  className={`${
                    drop.pinned ? "text-yellow-600" : "text-gray-500"
                  } hover:text-yellow-700 transition`}
                >
                  📌 {drop.pinned ? "Unpin" : "Pin"}
                </button>
                <button
                  onClick={() => handleDelete(drop.id)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  🪶 Release
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-8">
            <button
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:text-red-600"
            >
              🗑️ Clear All Drops
            </button>
            <a
              href="/"
              className="text-sm text-blue-500 hover:text-blue-600 underline"
            >
              ⬅️ Back to Drop It
            </a>
          </div>
        </>
      ) : (
        <p className="text-gray-500">You haven’t dropped any moods yet.</p>
      )}
    </div>
  );
}
