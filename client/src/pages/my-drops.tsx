"use client";

import * as React from "react";
import { moods } from "@/lib/moods";

type SavedMessage = {
  id: number;
  content: string;
  emotion: string;     // e.g., "Calm"
  timestamp: string;   // ISO
  pinned?: boolean;    // ⭐ NEW
};

const STORAGE_KEY = "mooddrop_messages";    // primary key
const LEGACY_KEYS = ["moodDrops"];          // migrate from here if present
const PAGE_SIZE = 10;

export default function MyDropsPage() {
  const [items, setItems] = React.useState<SavedMessage[]>([]);
  const [query, setQuery] = React.useState("");
  const [emotionFilter, setEmotionFilter] = React.useState<string>("All");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const [lastDeleted, setLastDeleted] = React.useState<SavedMessage | null>(null);
  const [animQueue, setAnimQueue] = React.useState<Array<{ id: number; color: string }>>([]); // for release animation

  // ---------- utils ----------
  const normalize = (it: any): SavedMessage => {
    const base: SavedMessage = {
      id: typeof it.id === "number" ? it.id : Date.now(),
      content: String(it.content ?? it.text ?? ""),
      emotion: String(it.emotion ?? it.mood ?? "Calm"),
      timestamp: String(it.timestamp ?? it.date ?? new Date().toISOString()),
      pinned: Boolean(it.pinned ?? false),
    };
    return base;
  };

  const sortPinnedThenRecent = (arr: SavedMessage[]) =>
    [...arr].sort((a, b) => {
      if ((b.pinned ? 1 : 0) !== (a.pinned ? 1 : 0)) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const dedupeById = (arr: SavedMessage[]) => {
    const map = new Map<number, SavedMessage>();
    for (const m of arr) map.set(m.id, m);
    return Array.from(map.values());
  };

  const readKey = (key: string): any[] => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const persist = (next: SavedMessage[]) => {
    const sorted = sortPinnedThenRecent(next);
    setItems(sorted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  };

  // ---------- load + migrate ----------
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const primary = readKey(STORAGE_KEY);
      const legacy = LEGACY_KEYS.flatMap(readKey);
      const merged = dedupeById([...primary, ...legacy].map(normalize));
      const sorted = sortPinnedThenRecent(merged);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
      setItems(sorted);
      for (const k of LEGACY_KEYS) localStorage.removeItem(k);
    } catch {
      setItems([]);
    }
  }, []);

  // ---------- moods / colors ----------
  const getMoodColor = (emotion: string) => {
    const mood = Object.values(moods).find((m: any) => m.key === emotion);
    return mood?.color || "#FCE7EF"; // blush fallback
  };

  // ---------- search + filter ----------
  const emotions = React.useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.emotion && set.add(i.emotion));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const matchEmotion = emotionFilter === "All" || i.emotion === emotionFilter;
      const matchQuery =
        q.length === 0 ||
        i.content.toLowerCase().includes(q) ||
        i.emotion.toLowerCase().includes(q);
      return matchEmotion && matchQuery;
    });
  }, [items, query, emotionFilter]);

  const visible = React.useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visible.length < filtered.length;

  React.useEffect(() => setVisibleCount(PAGE_SIZE), [query, emotionFilter]);

  // ---------- actions ----------
  const clearAll = () => {
    if (!confirm("Clear all drops on this device?")) return;
    persist([]);
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const removeOne = (id: number) => {
    const target = items.find((i) => i.id === id) || null;
    if (!target) return;

    // Trigger release animation with the mood color
    setAnimQueue((q) => [...q, { id: target.id, color: getMoodColor(target.emotion) }]);

    // proceed with delete (keep Undo behavior)
    const next = items.filter((i) => i.id !== id);
    persist(next);
    setLastDeleted(target);
  };

  const undoDelete = () => {
    if (!lastDeleted) return;
    persist([lastDeleted, ...items]);
    setLastDeleted(null);
  };

  const togglePin = (id: number) => {
    const next = items.map((i) => (i.id === id ? { ...i, pinned: !i.pinned } : i));
    persist(next);
  };

  // ---------- CSV ----------
  const exportCsv = () => {
    const rows = [
      ["id", "timestamp", "emotion", "content", "pinned"], // include pinned
      ...items.map((i) => [
        String(i.id),
        i.timestamp,
        i.emotion,
        i.content.replace(/\r?\n/g, "\\n"),
        i.pinned ? "1" : "0",
      ]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mooddrop-my-drops-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportCsv: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return;

    const header = parseCsvLine(lines[0]);
    const idx = {
      id: header.indexOf("id"),
      timestamp: header.indexOf("timestamp"),
      emotion: header.indexOf("emotion"),
      content: header.indexOf("content"),
      pinned: header.indexOf("pinned"),
    };
    if (idx.id < 0 || idx.timestamp < 0 || idx.emotion < 0 || idx.content < 0) {
      alert("CSV must include id,timestamp,emotion,content (pinned optional).");
      e.target.value = "";
      return;
    }

    const existingIds = new Set(items.map((i) => i.id));
    const imported: SavedMessage[] = [];

    for (let li = 1; li < lines.length; li++) {
      const cols = parseCsvLine(lines[li]);
      if (!cols.length) continue;
      const rawId = Number(cols[idx.id]);
      const msg: SavedMessage = {
        id: existingIds.has(rawId) || Number.isNaN(rawId) ? Math.floor(Math.random() * 1e9) : rawId,
        timestamp: cols[idx.timestamp],
        emotion: cols[idx.emotion],
        content: (cols[idx.content] || "").replace(/\\n/g, "\n"),
        pinned: idx.pinned >= 0 ? cols[idx.pinned] === "1" : false,
      };
      existingIds.add(msg.id);
      imported.push(normalize(msg));
    }

    const next = dedupeById([...imported, ...items]);
    persist(next);
    e.target.value = "";
  };

  function parseCsvLine(line: string): string[] {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            cur += '"';
            i++;
          } else inQuotes = false;
        } else cur += ch;
      } else {
        if (ch === '"') inQuotes = true;
        else if (ch === ",") {
          out.push(cur);
          cur = "";
        } else cur += ch;
      }
    }
    out.push(cur);
    return out;
  }

  // ---------- Mood Summary (30 days) ----------
  const summary = React.useMemo(() => {
    const now = Date.now();
    const cutoff = now - 30 * 24 * 60 * 60 * 1000;
    const recent = items.filter((i) => new Date(i.timestamp).getTime() >= cutoff);
    const counts = new Map<string, number>();
    for (const i of recent) counts.set(i.emotion, (counts.get(i.emotion) || 0) + 1);
    const total = recent.length || 1;
    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    return { recentCount: recent.length, rows: sorted, total };
  }, [items]);

  // ---------- UI ----------
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      {/* release animation styles & instances */}
      <style jsx global>{`
        @keyframes floatUpFade {
          0% { transform: translateY(0) scale(0.9); opacity: 0.9; }
          70% { transform: translateY(-80px) scale(1.05); opacity: 0.6; }
          100% { transform: translateY(-120px) scale(0.8); opacity: 0; }
        }
        .drop-float {
          position: fixed;
          left: 50%;
          bottom: 80px;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          animation: floatUpFade 1.2s ease-out forwards;
          pointer-events: none;
          z-index: 50;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }
      `}</style>
      {animQueue.map((a) => (
        <span
          key={a.id}
          className="drop-float"
          style={{ backgroundColor: a.color }}
          onAnimationEnd={() =>
            setAnimQueue((q) => q.filter((x) => x.id !== a.id))
          }
        />
      ))}

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-warm-gray-900">My Drops</h1>
        <p className="text-sm text-warm-gray-600">Private reflections stored only on this device.</p>

        {/* Mood Summary */}
        <section className="mt-3 rounded-2xl border border-blush-100 bg-cream-50 px-4 py-3">
          <div className="text-sm font-medium text-warm-gray-900">
            Mood Summary (last 30 days)
          </div>
          {summary.rows.length === 0 ? (
            <div className="text-sm text-warm-gray-600 mt-1">No recent drops yet.</div>
          ) : (
            <div className="mt-2 space-y-2">
              {summary.rows.map(([emotion, count]) => {
                const pct = Math.round((count / summary.total) * 100);
                const barColor = getMoodColor(emotion);
                return (
                  <div key={emotion} className="grid grid-cols-5 items-center gap-3">
                    <div className="col-span-1 text-xs text-warm-gray-700">{emotion}</div>
                    <div className="col-span-3 h-2 rounded-full bg-white/70 border border-zinc-200/60 overflow-hidden">
                      <div
                        className="h-full"
                        style={{ width: `${pct}%`, backgroundColor: barColor }}
                      />
                    </div>
                    <div className="col-span-1 text-xs text-right text-warm-gray-600">
                      {count} ({pct}%)
                    </div>
                  </div>
                );
              })}
              <div className="text-xs text-zinc-500 pt-1">
                Total recent drops: <span className="font-medium">{summary.recentCount}</span>
              </div>
            </div>
          )}
        </section>

        {/* controls */}
        <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-xl px-3 py-2 bg-cream-50 text-warm-gray-700 border border-blush-100 hover:bg-cream-100 transition"
            >
              ← Back
            </a>
            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="rounded-xl px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              aria-label="Search drops"
              placeholder="Search drops…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-48 rounded-xl border border-zinc-200 px-3 py-2 bg-white/90"
            />
            <select
              aria-label="Filter by emotion"
              value={emotionFilter}
              onChange={(e) => setEmotionFilter(e.target.value)}
              className="rounded-xl border border-zinc-200 px-3 py-2 bg-white/90"
            >
              {emotions.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            <button
              onClick={exportCsv}
              className="rounded-xl border border-zinc-200 px-3 py-2 hover:bg-gray-50"
            >
              Export CSV
            </button>

            <label className="rounded-xl border border-zinc-200 px-3 py-2 hover:bg-gray-50 cursor-pointer">
              Import CSV
              <input type="file" accept=".csv,text/csv" onChange={onImportCsv} className="hidden" />
            </label>
          </div>
        </div>
      </header>

      {lastDeleted && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-900 flex items-center justify-between">
          <span>Drop deleted.</span>
          <button onClick={undoDelete} className="font-medium underline">Undo</button>
        </div>
      )}

      {/* list */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-blush-100 bg-cream-50 p-6 text-warm-gray-700">
          {items.length === 0
            ? <>No drops yet. After you press <span className="font-medium">Drop It</span>, they’ll appear here.</>
            : <>No results match your search/filter.</>}
        </div>
      ) : (
        <>
          <div className="text-xs text-zinc-500">
            Showing <span className="font-medium">{visible.length}</span> of{" "}
            <span className="font-medium">{filtered.length}</span> drops
          </div>

          <ul className="space-y-3">
            {visible.map((m) => (
              <li
                key={m.id}
                className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 shadow-sm flex items-start gap-3"
              >
                <div
                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: getMoodColor(m.emotion) }}
                />
                <div className="flex-1">
                  <div className="text-sm text-warm-gray-500 flex items-center gap-2">
                    <span>{fmt(m.timestamp)} • {m.emotion}</span>
                    {m.pinned && (
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 text-[11px]">
                        🌟 Pinned
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-warm-gray-900 whitespace-pre-wrap">{m.content}</div>
                </div>

                <div className="flex flex-col items-end gap-1 ml-2">
                  <button
                    onClick={() => togglePin(m.id)}
                    className="text-xs rounded-lg border border-zinc-200 px-2 py-1 hover:bg-gray-50"
                    aria-label={m.pinned ? "Unpin drop" : "Pin drop"}
                    title={m.pinned ? "Unpin" : "Pin"}
                  >
                    {m.pinned ? "Unpin 🌟" : "Pin ☆"}
                  </button>
                  <button
                    onClick={() => removeOne(m.id)}
                    className="text-xs text-rose-700 hover:underline"
                    aria-label="Delete drop"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="rounded-2xl border border-zinc-200 px-4 py-2 hover:bg-gray-50"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}

      <p className="text-xs text-zinc-400">
        Tip: clearing browser data will remove your drops. Export a CSV (or JSON later) to back them up first.
      </p>
    </main>
  );
}
