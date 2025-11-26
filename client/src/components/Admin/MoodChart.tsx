interface MoodChartProps {
  data?: any[]; // make optional so undefined doesn't break the page
}

export function MoodChart({ data }: MoodChartProps) {
  // Safely handle undefined or null data
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
        <p>No mood data available</p>
      </div>
    );
  }

  // 👉 Replace your chart code here
  // For now we keep a placeholder so it doesn't crash
  return (
    <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
      <p>Mood chart will render here.</p>
    </div>
  );
}
