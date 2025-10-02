import { useMemo, useState } from "react";
import "./index.css";

type Entry = { id: string; ts: number; title: string; body: string };
const KEY = "md_journal";

function load(): Entry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function save(entries: Entry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}
function niceDate(ts: number) {
  return new Date(ts).toLocaleString();
}

export default function Journal() {
  const [entries, setEntries] = useState<Entry[]>(() => load());
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const canSave = useMemo(() => title.trim().length > 0 || body.trim().length > 0, [title, body]);

  const onSave = () => {
    if (!canSave) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const next = [{ id, ts: Date.now(), title: title.trim(), body: body.trim() }, ...entries];
    setEntries(next); save(next);
    setTitle(""); setBody("");
  };

  const onDelete = (id: string) => {
    const next = entries.filter(e => e.id !== id);
    setEntries(next); save(next);
  };

  return (
    <section className="card">
      <h2>📝 Private Journal</h2>
      <p className="muted">Stored only on this device. You can erase anytime by clearing site data.</p>

      <div className="jr-form">
        <input
          className="inp"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="inp"
          rows={6}
          placeholder="Write what’s on your mind…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="jr-actions">
          <button className="btn btn--primary" onClick={onSave} disabled={!canSave}>Save entry</button>
          <button className="btn" onClick={() => { setTitle(""); setBody(""); }}>Clear</button>
        </div>
      </div>

      {entries.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <h3>Recent entries</h3>
          <ul className="jr-list">
            {entries.map(e => (
              <li key={e.id} className="jr-item">
                <div className="jr-meta">
                  <strong>{e.title || "Untitled"}</strong>
                  <span className="muted">{niceDate(e.ts)}</span>
                </div>
                {e.body && <p className="jr-body">{e.body}</p>}
                <div className="jr-actions">
                  <button className="link danger" onClick={() => onDelete(e.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
