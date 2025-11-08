import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 🩵 MoodDrop debug trace
console.log("[MoodDrop] main.tsx mounted");

const container = document.getElementById("root");
if (!container) {
  console.error("[MoodDrop] ❌ Root element not found. Check index.html.");
} else {
  console.log("[MoodDrop] ✅ Root element found — rendering App...");
  createRoot(container).render(<App />);
}
