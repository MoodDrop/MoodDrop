import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MoodChartProps {
  data: { name: string; value: number }[];
}

export function MoodChart({ data }: MoodChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-stone-400">
        <p>No mood data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
        <XAxis dataKey="name" stroke="#78716c" fontSize={12} />
        <YAxis stroke="#78716c" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e7e5e4",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="value" fill="#fda4af" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
