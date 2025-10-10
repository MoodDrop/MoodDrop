import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";

type Mode = "quick" | "guided" | "letter";

const MAX_QUICK = 280;

const GUIDED_PROMPTS = [
  {
    id: "stressor",
    title: "Name the stressor",
    prompt:
      "What happened? Stick to the facts first. Where were you, who was involved, and what kicked this off?",
    followUps: [
      "What part of this do you control vs. don’t control?",
      "What would you tell a friend in the same situation?"
    ],
  },
  {
    id: "reframe",
    title: "Reframe the story",
    prompt:
      "What meaning am I giving this? Try writing a second, kinder interpretation.",
    followUps: [
      "If this is temporary, what does ‘temporary’ look like?",
      "What small step would make things 1% better?"
    ],
  },
  {
    id: "needs",
    title: "Needs behind the feeling",
    prompt:
      "Underneath my feeling, what need isn’t being met (e.g., rest, respect, clarity, support)?",
    followUps: [
      "What’s one way I can ask for or give myself that need?",
      "What boundary would protect that need next time?"
    ],
  },
];

export default function ReleasePage() {
  const [mode, setMode] = useState<Mode>("quick");

  // --- Quick Release ---
  const [quickText, setQuickText] = useState("");
  const quickCount = useMemo(() => quickText.length, [quickText]);

  // --- Guided ---
  const [guidedId, setGuidedId] = useState(GUIDED_PROMPTS[0].id);
  const selected = useMemo(
    () => GUIDED_PROMPTS.find((p) => p.id === guidedId)!,
    [guidedId]
  );
  const [guidedNotes, setGuidedNotes] = useState("");

  // --- Open Letter ---
  const [toWhom, setToWhom] = useState("");
  const [letter, setLetter] = useState("");

  // draft persistence (local only)
  useEffect(() => {
    const drafts = localStorage.getItem("release:drafts");
    if (!drafts) return;
    try {
      const parsed = JSON.parse(drafts);
      setQuickText(parsed.quickText ?? "");
      setGuidedId(parsed.guidedId ?? GUIDED_PROMPTS[0].id);
      setGuidedNotes(parsed.guidedNotes ?? "");
      setToWhom(parsed.toWhom ?? "");
      setLetter(parsed.letter ?? "");
    } catch {}
  }, []);

  const saveDraft = () => {
    localStorage.setItem(
      "release:drafts",
      JSON.stringify({ quickText, guidedId, guidedNotes, toWhom, letter })
    );
  };

  const clearAll = () => {
    setQuickText("");
    setGuidedNotes("");
    setToWhom("");
    setLetter("");
    localStorage.removeItem("release:drafts");
  };

  const submitQuick = () => {
    if (!quickText.trim()) return;
    stashEntry({
      type: "quick",
      title: "Quick Release",
      content: quickText.trim(),
    });
    setQuickText("");
  };

  const submitGuided = () => {
    if (!guidedNotes.trim()) return;
    stashEntry({
      type: "guided",
      title: selected.title,
      content: `${selected.prompt}\n\n${guidedNotes.trim()}`,
    });
    setGuidedNotes("");
  };

  const submitLetter = () => {
    if (!letter.trim()) return;
    const to = toWhom.trim() || "Open Letter";
    stashEntry({ type: "letter", title: `Letter to ${to}`, content: letter.trim() });
    setLetter("");
    setToWhom("");
  };

  // store in local history (private)
  const stashEntry = (entry: { type: string; title: string; content: string }) => {
    const key = "release:history";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    prev.unshift({
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(prev.slice(0, 100))); // keep last 100
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Release Space</h1>
        <p className="mt-2 text-sm text-gray-500">
          Offload your thoughts privately. Nothing here is shared — everything stays on your device.
        </p>
        <div className="mt-3 text-sm">
          Having a rough moment? Try some{" "}
          <Link to="/comfort" className="text-blue-600 underline">
            calming sounds
          </Link>{" "}
          before or after you write.
        </div>
      </header>

      {/* Mode Tabs */}
      <div className="mb-6 flex gap-2">
        <TabButton active={mode === "quick"} onClick={() => setMode("quick")}>
          Quick Release
        </TabButton>
        <TabButton active={mode === "guided"} onClick={() => setMode("guided")}>
          Guided Prompt
        </TabButton>
        <TabButton active={mode === "letter"} onClick={() => setMode("letter")}>
          Open Letter
        </TabButton>
      </div>

      {/* Panels */}
      {mode === "quick" && (
        <section className="rounded-lg border p-4">
          <p className="mb-2 text-sm text-gray-600">
            Type it, breathe it out, and let the page hold it for you.
          </p>
          <textarea
            className="h-40 w-full resize-none rounded border p-3 outline-none focus:ring"
            placeholder="What do you want to release?"
            maxLength={MAX_QUICK}
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
          />
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className={quickCount >= MAX_QUICK ? "text-red-600" : "text-gray-500"}>
              {quickCount}/{MAX_QUICK}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={saveDraft}>
                Save draft
              </Button>
              <Button variant="ghost" onClick={clearAll}>
                Clear
              </Button>
              <Button onClick={submitQuick} disabled={!quickText.trim()}>
                Release
              </Button>
            </div>
          </div>
        </section>
      )}

      {mode === "guided" && (
        <section className="rounded-lg border p-4">
          <div className="mb-3">
            <label className="mb-1 block text-sm font-medium">Choose a prompt</label>
            <select
              className="w-full rounded border p-2"
              value={guidedId}
              onChange={(e) => setGuidedId(e.target.value)}
            >
              {GUIDED_PROMPTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2 rounded bg-gray-50 p-3 text-sm">
            <p className="font-medium">{selected.title}</p>
            <p className="text-gray-600">{selected.prompt}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
              {selected.followUps.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          <textarea
            className="h-48 w-full resize-none rounded border p-3 outline-none focus:ring"
            placeholder="Write your reflection here…"
            value={guidedNotes}
            onChange={(e) => setGuidedNotes(e.target.value)}
          />

          <div className="mt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={saveDraft}>
              Save draft
            </Button>
            <Button variant="ghost" onClick={clearAll}>
              Clear
            </Button>
            <Button onClick={submitGuided} disabled={!guidedNotes.trim()}>
              Release
            </Button>
          </div>
        </section>
      )}

      {mode === "letter" && (
        <section className="rounded-lg border p-4">
          <div className="mb-3">
            <label className="mb-1 block text-sm font-medium">Who is this for?</label>
            <input
              className="w-full rounded border p-2"
              placeholder='e.g., “Past Me”, “The Situation”, or leave blank'
              value={toWhom}
              onChange={(e) => setToWhom(e.target.value)}
            />
          </div>

          <textarea
            className="h-56 w-full resize-none rounded border p-3 outline-none focus:ring"
            placeholder="Write your open letter… say everything you need to say."
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
          />

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-gray-500">
              Optional ritual: after releasing, you can delete it, keep it, or export it as a note.
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={saveDraft}>
                Save draft
              </Button>
              <Button variant="ghost" onClick={clearAll}>
                Clear
              </Button>
              <Button onClick={submitLetter} disabled={!letter.trim()}>
                Release
              </Button>
            </div>
          </div>
        </section>
      )}

      <History />
    </div>
  );
}

/* ----------------- small components ----------------- */

function TabButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

function Button({
  children,
  onClick,
  disabled,
  variant = "solid",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "solid" | "ghost";
}) {
  const base =
    "rounded px-4 py-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "ghost"
      ? "bg-transparent text-gray-700 hover:bg-gray-100"
      : "bg-blue-600 text-white hover:bg-blue-700";
  return (
    <button className={`${base} ${styles}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function History() {
  const [items, setItems] = useState<
    { id: string; title: string; content: string; createdAt: string }[]
  >([]);

  useEffect(() => {
    const key = "release:history";
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    setItems(data);
  }, []);

  const clear = () => {
    localStorage.removeItem("release:history");
    setItems([]);
  };

  if (!items.length) return null;

  return (
    <section className="mt-8 rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-medium">Recent Releases (private)</h2>
        <button
          className="text-sm text-red-600 underline hover:opacity-80"
          onClick={clear}
        >
          Clear history
        </button>
      </div>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="rounded border p-3">
            <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
              <span className="font-medium text-gray-700">{it.title}</span>
              <time>{new Date(it.createdAt).toLocaleString()}</time>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {it.content}
            </pre>
          </li>
        ))}
      </ul>
    </section>
  );
}
