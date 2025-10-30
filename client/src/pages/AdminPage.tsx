import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/Admin/Card";
import { FlagToggle } from "@/components/Admin/FlagToggle";
import { MoodChart } from "@/components/Admin/MoodChart";
import { readFlags, setFlag } from "@/lib/featureFlags";
import { useToast } from "@/hooks/use-toast";

interface SavedDrop {
  mood?: string;
  emotion?: string;
  text?: string;
  content?: string;
  body?: string;
  timestamp?: string;
  createdAt?: string;
  time?: number;
}

export default function AdminPage() {
  const { toast } = useToast();
  const [drops, setDrops] = useState<SavedDrop[]>([]);
  const [flags, setFlags] = useState(readFlags());

  useEffect(() => {
    const ok = localStorage.getItem("mooddrop_admin_ok");
    if (!ok) {
      const pass = prompt("Admin access: enter password");
      if (pass === import.meta.env.VITE_ADMIN_PASS) {
        localStorage.setItem("mooddrop_admin_ok", "true");
      } else {
        window.location.href = "/";
      }
    }
  }, []);

  useEffect(() => {
    loadDrops();
  }, []);

  const loadDrops = () => {
    try {
      const raw = localStorage.getItem("mooddrop_messages");
      if (!raw) {
        setDrops([]);
        return;
      }
      const parsed = JSON.parse(raw);
      setDrops(Array.isArray(parsed) ? parsed : []);
    } catch {
      setDrops([]);
    }
  };

  const getMood = (d: SavedDrop): string => {
    return d.mood || d.emotion || "unknown";
  };

  const getText = (d: SavedDrop): string => {
    return d.text || d.content || d.body || "";
  };

  const getTimestamp = (d: SavedDrop): number => {
    if (d.timestamp) return new Date(d.timestamp).getTime();
    if (d.createdAt) return new Date(d.createdAt).getTime();
    if (d.time) return d.time;
    return 0;
  };

  const totalDrops = drops.length;

  const moodCounts = drops.reduce((acc, d) => {
    const mood = getMood(d);
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const top3Moods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([mood]) => mood)
    .join(", ") || "—";

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeekCount = drops.filter((d) => getTimestamp(d) >= sevenDaysAgo).length;

  const chartData = Object.entries(moodCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const recent5 = [...drops]
    .sort((a, b) => getTimestamp(b) - getTimestamp(a))
    .slice(0, 5);

  const handleFlagChange = (key: keyof typeof flags, value: boolean) => {
    setFlag(key, value);
    setFlags(readFlags());
    toast({ title: "Feature flag updated" });
  };

  const handleExportCSV = () => {
    const rows = drops.map((d) => {
      const timestamp = getTimestamp(d);
      const date = timestamp ? new Date(timestamp).toISOString() : "";
      const mood = getMood(d);
      const text = getText(d).replace(/"/g, '""');
      return `"${date}","${mood}","${text}"`;
    });
    const csv = ["date,mood,text", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mooddrop-admin-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported successfully" });
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split("\n").slice(1);
        const imported: SavedDrop[] = [];

        lines.forEach((line) => {
          if (!line.trim()) return;
          const match = line.match(/^"([^"]*)","([^"]*)","((?:[^"]|"")*)"/);
          if (match) {
            imported.push({
              timestamp: match[1],
              mood: match[2],
              text: match[3].replace(/""/g, '"'),
            });
          }
        });

        const merged = [...drops, ...imported];
        localStorage.setItem("mooddrop_messages", JSON.stringify(merged));
        loadDrops();
        toast({
          title: "Imported successfully",
          description: `${imported.length} drops imported`,
        });
      } catch {
        toast({
          title: "Import failed",
          description: "Invalid CSV format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClearAll = () => {
    if (!confirm("Are you sure you want to delete all drops? This cannot be undone.")) return;
    localStorage.setItem("mooddrop_messages", JSON.stringify([]));
    loadDrops();
    toast({ title: "All drops cleared" });
  };

  const plausibleUrl = import.meta.env.VITE_PLAUSIBLE_PUBLIC_URL;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-stone-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">Admin Dashboard</h1>
          <p className="text-stone-600">Private overview for the owner</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Total Drops">
            <p className="text-4xl font-bold text-rose-400" data-testid="stat-total-drops">
              {totalDrops}
            </p>
          </Card>
          <Card title="Top Moods">
            <p className="text-lg text-stone-700" data-testid="stat-top-moods">
              {top3Moods}
            </p>
          </Card>
          <Card title="Drops (Last 7 Days)">
            <p className="text-4xl font-bold text-rose-400" data-testid="stat-week-drops">
              {thisWeekCount}
            </p>
          </Card>
        </div>

        <Card title="Mood Distribution">
          <MoodChart data={chartData} />
        </Card>

        <Card title="Recent Drops" subtitle="Last 5 drops">
          {recent5.length === 0 ? (
            <p className="text-stone-400">No drops yet</p>
          ) : (
            <div className="space-y-3">
              {recent5.map((drop, idx) => {
                const timestamp = getTimestamp(drop);
                const date = timestamp
                  ? new Date(timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Unknown";
                const mood = getMood(drop);
                const text = getText(drop);
                const preview = text.length > 120 ? text.slice(0, 120) + "..." : text;

                return (
                  <div
                    key={idx}
                    className="border-b border-stone-100 pb-3 last:border-0"
                    data-testid={`recent-drop-${idx}`}
                  >
                    <p className="text-sm text-stone-500">
                      {date} • <span className="capitalize">{mood}</span>
                    </p>
                    <p className="text-stone-700 mt-1">{preview}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card title="Traffic Analytics" subtitle="Plausible public dashboard">
          {plausibleUrl ? (
            <iframe
              src={plausibleUrl}
              loading="lazy"
              className="w-full h-96 rounded-lg border border-stone-200"
              title="Plausible Analytics"
            />
          ) : (
            <p className="text-stone-500 text-sm">
              Add <code className="bg-stone-100 px-2 py-1 rounded">VITE_PLAUSIBLE_PUBLIC_URL</code>{" "}
              to your environment variables to embed analytics
            </p>
          )}
        </Card>

        <Card title="Feature Flags" subtitle="Toggle app features">
          <div className="space-y-2">
            <FlagToggle
              label="Voice Notes"
              description="Allow users to record voice notes"
              enabled={flags.enableVoiceNotes}
              onChange={(val) => handleFlagChange("enableVoiceNotes", val)}
            />
            <FlagToggle
              label="Mood Garden Tab"
              description="Show Mood Garden (currently Coming Soon)"
              enabled={flags.showMoodGardenTab}
              onChange={(val) => handleFlagChange("showMoodGardenTab", val)}
            />
            <FlagToggle
              label="Affirmations"
              description="Show affirmations after drops"
              enabled={flags.enableAffirmations}
              onChange={(val) => handleFlagChange("enableAffirmations", val)}
            />
          </div>
        </Card>

        <Card title="Data Tools" subtitle="Manage drop data">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition-colors"
              data-testid="button-export-csv"
            >
              Export CSV
            </button>
            <label className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors cursor-pointer">
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
                data-testid="input-import-csv"
              />
            </label>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              data-testid="button-clear-all"
            >
              Clear All
            </button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-500">
              Build mode: <code className="bg-stone-100 px-2 py-1 rounded">{import.meta.env.MODE}</code>
            </p>
            <Link href="/" className="text-rose-400 hover:text-rose-500 transition-colors" data-testid="link-home">
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
