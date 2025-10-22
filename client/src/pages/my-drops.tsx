"use client";

import * as React from "react";

type SavedMessage = {
  id: number;
  content: string;
  emotion: string;
  timestamp: string;
};

const STORAGE_KEY = "mooddrop_messages";

export default function MyDropsPage() {
  const [items, setItems] = React.useState<SavedMessage[]>([]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data: SavedMessage[] = raw ? JSON.parse(raw) : [];
      data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setItems(data);
    } catch {
      setItems([]);
    }
  }, []);

  const removeOne = (id: number) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const clearAll = () => {
    if (!confirm("Clear all drops on this device?")) return;
    setItems([]);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([])); } catch {}
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-warm-gray-900">My Drops</h1>
        <p className="text-sm text-warm-gray-600">Private reflections stored only on this device.</p>

        <div className="flex items-center gap-3 pt-2">
          <a href="/" className="rounded-xl px-3 py-2 bg-cream-50 text-warm-gray-700 border border-blush-100 hover:bg-cream-100 transition">
            ← Back
          </a>
          {items.length > 0 && (
            <button onClick={clearAll} className="rounded-xl px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition">
              Clear all
            </button>
          )}
        </div>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-blush-100 bg-cream-50 p-6 text-warm-gray-700">
          No drops yet. After you press <span className="font-medium">Drop It</span>, they’ll appear here.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map(m => (
            <li key={m.id} className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-warm-gray-500">{fmt(m.timestamp)} • {m.emotion}</div>
                  <div className="mt-1 text-warm-gray-900 whitespace-pre-wrap">{m.content}</div>
                </div>
                <button onClick={() => removeOne(m.id)} className="text-sm text-rose-700 hover:underline" aria-label="Delete drop">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-zinc-400">Tip: clearing browser data will remove your drops.</p>
    </main>
  );
}
