import Journal from "./Journal";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 560 }}>
        <h1 style={{ margin: 0 }}>MoodDrop</h1>
        <p style={{ opacity: .85, marginTop: 8 }}>
          Gentle, private space for mood check-ins, guided reflections, and calm.
        </p>
      </div>
    </div>
  );
}

{/* MOOD TRACKER (already on your page) */}
// <MoodTracker />

{/* JOURNAL */}
<Journal />
