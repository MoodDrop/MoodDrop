// client/src/pages/CalmStudioPage.tsx

export default function CalmStudioPage() {
  return (
    <div style={{ padding: "40px", background: "white", color: "black" }}>
      
      {/* Coming Soon Notice */}
      <div
        style={{
          background: "#f8f1ec",
          border: "1px solid #eadbd2",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "24px"
        }}
      >
        <strong>Calm Studio is on the way 🌿</strong>
        <p style={{ marginTop: "6px", fontSize: "14px" }}>
          We're building a quiet space for breathing, soothing sounds, gentle visuals,
          and calming interactions. A soft reset for your mind and body.
        </p>
      </div>

      <h1>Calm Studio</h1>
      <p>This space is currently being prepared.</p>

      <div style={{ marginTop: "30px" }}>
        <h2>Take a Breath</h2>
        <p>A small pause for your body and mind.</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Soft Visuals</h2>
        <p>Gentle moments for when your mind needs less noise.</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Soothing Sounds</h2>
        <p>Let the room soften around you.</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Gentle Play</h2>
        <p>Quiet interaction for restless moments.</p>
      </div>
    </div>
  );
}