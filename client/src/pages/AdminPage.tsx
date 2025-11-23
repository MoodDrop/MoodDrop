// client/src/pages/AdminPage.tsx

import { useEffect, useMemo, useState, ChangeEvent } from "react";
import { Link } from "wouter";
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Settings,
  AlertTriangle,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { MoodChart } from "@/components/Admin/MoodChart";
import { FlagToggle } from "@/components/Admin/FlagToggle";
import { readFlags, setFlag } from "@/lib/featureFlags";

type SavedDrop = {
  id?: string;
  text?: string;
  content?: string;
  body?: string;

  mood?: string;
  emotion?: string;

  timestamp?: number | string;
  createdAt?: number | string;
  time?: number | string;
};

type AdminSection = "dashboard" | "traffic" | "engagement" | "settings" | "danger";

const LOCAL_KEY = "mooddrop_messages";

function getMood(d: SavedDrop): string {
  return (d.mood || d.emotion || "unknown").toLowerCase();
}

function getText(d: SavedDrop): string {
  return (
    d.text ||
    d.content ||
    d.body ||
    ""
  ).trim();
}

function getTimestamp(d: SavedDrop): number {
  const raw = d.timestamp ?? d.createdAt ?? d.time;
  if (raw == null) return 0;
  if (typeof raw === "number") return raw;
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function loadDrops(): SavedDrop[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveDrops(drops: SavedDrop[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(drops));
}

export default function AdminPage() {
  const { toast } = useToast();

  const [section, setSection] = useState<AdminSection>("dashboard");
  const [drops, setDrops] = useState<SavedDrop[]>([]);
  const [flags, setFlagsState] = useState<Record<string, boolean>>({});
  const [isReady, setIsReady] = useState(false);

  const plausibleUrl = import.meta.env.VITE_PLAUSIBLE_PUBLIC_URL as
    | string
    | undefined;

  // Simple password gate (reuses your existing behavior)
  useEffect(() => {
    const ok = localStorage.getItem("mooddrop_admin_ok");
    if (!ok) {
      const input = window.prompt("Enter admin password:");
      if (!input || input !== import.meta.env.VITE_ADMIN_PASS) {
        window.location.href = "/";
        return;
      }
      localStorage.setItem("mooddrop_admin_ok", "1");
    }

    setDrops(loadDrops());
    setFlagsState(readFlags());
    setIsReady(true);
  }, []);

  const stats = useMemo(() => {
    const total = drops.length;
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const moodsCount: Record<string, number> = {};
    let last7 = 0;

    for (const d of drops) {
      const mood = getMood(d) || "unknown";
      moodsCount[mood] = (moodsCount[mood] || 0) + 1;

      const ts = getTimestamp(d);
      if (ts >= sevenDaysAgo) last7++;
    }

    const moodEntries = Object.entries(moodsCount).sort(
      (a, b) => b[1] - a[1]
    );

    const topMoods = moodEntries.slice(0, 3).map(([m]) => m);
    const chartData = moodEntries.map(([name, value]) => ({
      name,
      value,
    }));

    const recent = [...drops].sort(
      (a, b) => getTimestamp(b) - getTimestamp(a)
    ).slice(0, 5);

    return {
      totalDrops: total,
      dropsLast7: last7,
      topMoods,
      uniqueMoods: moodEntries.length,
      chartData,
      recent,
    };
  }, [drops]);

  const handleFlagChange = (key: string, value: boolean) => {
    setFlag(key, value);
    const next = readFlags();
    setFlagsState(next);
    toast({
      title: "Feature flag updated",
      description: `${key} set to ${value ? "ON" : "OFF"}`,
    });
  };

  const handleExportCsv = () => {
    if (!drops.length) {
      toast({ title: "No drops to export", description: "Your list is empty." });
      return;
    }

    const rows = [
      `"date","mood","text"`,
      ...drops.map((d) => {
        const date = new Date(getTimestamp(d) || Date.now()).toISOString();
        const mood = (getMood(d) || "").replace(/"/g, '""');
        const text = getText(d).replace(/"/g, '""');
        return `"${date}","${mood}","${text}"`;
      }),
    ];

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `mooddrop-admin-export-${today}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({ title: "Exported successfully", description: "CSV file downloaded." });
  };

  const handleImportCsv = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const lines = text.split(/\r?\n/).filter(Boolean);
        const imported: SavedDrop[] = [];

        // skip header
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          // naive CSV split on "," while handling quotes
          const match = line.match(/^"(.+?)","(.*?)","(.*)"$/);
          if (!match) continue;
          const [, dateStr, moodStr, bodyStr] = match;
          const ts = Date.parse(dateStr);

          imported.push({
            mood: moodStr,
            text: bodyStr,
            timestamp: Number.isNaN(ts) ? Date.now() : ts,
          });
        }

        if (!imported.length) {
          toast({
            title: "No valid rows found",
            description: "Check the CSV format and try again.",
          });
          return;
        }

        const merged = [...drops, ...imported];
        saveDrops(merged);
        setDrops(merged);

        toast({
          title: "Import complete",
          description: `Imported ${imported.length} drops.`,
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Import failed",
          description: "There was a problem reading that file.",
          variant: "destructive",
        });
      } finally {
        e.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  const handleClearAll = () => {
    const ok = window.confirm(
      "This will permanently delete ALL stored drops in localStorage. Continue?"
    );
    if (!ok) return;

    saveDrops([]);
    setDrops([]);
    toast({
      title: "All drops cleared",
      description: "Local admin history has been reset.",
      variant: "destructive",
    });
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 text-rose-900">
        <p className="text-sm opacity-70">Loading MoodDrop Admin…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 text-rose-900 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-rose-100 bg-rose-50/80 backdrop-blur-sm px-5 py-6 flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-xs">
              💧
            </span>
            <div>
              <div className="text-xs uppercase tracking-[0.15em] text-rose-400">
                MoodDrop!
              </div>
              <div className="font-semibold text-sm">Admin Dashboard</div>
            </div>
          </div>
          <p className="text-xs text-rose-400">
            Quiet overview of how your space is doing.
          </p>
        </div>

        <nav className="flex-1 flex flex-col gap-6 text-sm">
          <div className="space-y-1">
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={section === "dashboard"}
              onClick={() => setSection("dashboard")}
            />
            <SidebarItem
              icon={BarChart3}
              label="Traffic"
              active={section === "traffic"}
              onClick={() => setSection("traffic")}
            />
            <SidebarItem
              icon={Activity}
              label="Engagement"
              active={section === "engagement"}
              onClick={() => setSection("engagement")}
            />
            <SidebarItem
              icon={Settings}
              label="Settings"
              active={section === "settings"}
              onClick={() => setSection("settings")}
            />
          </div>

          <div className="border-t border-rose-100 pt-4 mt-auto">
            <SidebarItem
              icon={AlertTriangle}
              label="Danger Zone"
              active={section === "danger"}
              onClick={() => setSection("danger")}
              danger
            />
          </div>
        </nav>

        <div className="mt-auto text-[11px] text-rose-400 flex flex-col gap-1">
          <Link href="/" className="hover:underline">
            ← Back to MoodDrop
          </Link>
          <span>Mode: {import.meta.env.MODE}</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-6 py-6">
        {section === "dashboard" && (
          <DashboardSection stats={stats} />
        )}

        {section === "traffic" && (
          <TrafficSection plausibleUrl={plausibleUrl} />
        )}

        {section === "engagement" && (
          <EngagementSection stats={stats} />
        )}

        {section === "settings" && (
          <SettingsSection
            flags={flags}
            onFlagChange={handleFlagChange}
            onExport={handleExportCsv}
            onImport={handleImportCsv}
          />
        )}

        {section === "danger" && (
          <DangerSection onClearAll={handleClearAll} />
        )}
      </main>
    </div>
  );
}

/* --- Sidebar item component --- */

type SidebarItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
};

function SidebarItem({
  icon: Icon,
  label,
  active,
  danger,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left transition",
        active
          ? "bg-rose-100 text-rose-900 shadow-sm"
          : "text-rose-500 hover:bg-rose-100/70 hover:text-rose-900",
        danger && "text-red-500 hover:bg-red-50 hover:text-red-700",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

/* --- Sections --- */

type Stats = ReturnType<typeof AdminPage> extends JSX.Element
  ? never
  : never; // ignore

type DashboardStats = ReturnType<typeof useMemo>;

type DashboardProps = {
  stats: {
    totalDrops: number;
    dropsLast7: number;
    topMoods: string[];
    uniqueMoods: number;
    chartData: { name: string; value: number }[];
    recent: SavedDrop[];
  };
};

function DashboardSection({ stats }: DashboardProps) {
  const { totalDrops, dropsLast7, topMoods, uniqueMoods, chartData, recent } =
    stats;

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-rose-900">Dashboard</h1>
          <p className="text-xs text-rose-400">
            At-a-glance view of drops and moods.
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Drops"
          value={totalDrops.toLocaleString()}
          hint="All time"
        />
        <StatCard
          title="Last 7 Days"
          value={dropsLast7.toLocaleString()}
          hint="Recent drops"
        />
        <StatCard
          title="Top Moods"
          value={topMoods.length ? topMoods.join(" • ") : "No data"}
          hint={`${uniqueMoods || 0} unique moods`}
        />
        <StatCard
          title="Average per Day"
          value={
            dropsLast7
              ? (dropsLast7 / 7).toFixed(1)
              : "0.0"
          }
          hint="Based on last week"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white/80 border border-rose-100 shadow-sm p-4 lg:col-span-2">
          <h2 className="text-xs font-semibold text-rose-500 mb-3 uppercase tracking-[0.18em]">
            Mood Distribution
          </h2>
          {chartData.length ? (
            <MoodChart data={chartData} />
          ) : (
            <p className="text-xs text-rose-400">
              Not enough data yet to show mood trends.
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-white/80 border border-rose-100 shadow-sm p-4 space-y-3">
          <h2 className="text-xs font-semibold text-rose-500 mb-1 uppercase tracking-[0.18em]">
            Recent Drops
          </h2>
          {recent.length ? (
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {recent.map((d, idx) => {
                const ts = getTimestamp(d);
                const date = ts
                  ? new Date(ts).toLocaleString()
                  : "Unknown time";
                const mood = getMood(d) || "unknown";
                const text = getText(d) || "No text";

                return (
                  <li
                    key={idx}
                    className="rounded-xl border border-rose-100 bg-rose-50/60 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-medium capitalize text-rose-600">
                        {mood}
                      </span>
                      <span className="text-[10px] text-rose-400">
                        {date}
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-700 line-clamp-3">
                      {text}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-xs text-rose-400">
              Drops will appear here as your community starts sharing.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

type TrafficProps = {
  plausibleUrl?: string;
};

function TrafficSection({ plausibleUrl }: TrafficProps) {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-rose-900">Traffic</h1>
        <p className="text-xs text-rose-400">
          High-level visitor analytics powered by Plausible.
        </p>
      </header>

      {plausibleUrl ? (
        <div className="rounded-2xl border border-rose-100 bg-white/80 shadow-sm overflow-hidden">
          <iframe
            src={plausibleUrl}
            className="w-full h-[520px]"
            title="MoodDrop Plausible Analytics"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-rose-100 bg-white/80 shadow-sm p-4 text-xs text-rose-500">
          <p className="mb-1 font-medium">Plausible not configured.</p>
          <p>
            Set <code className="text-[11px] bg-rose-50 px-1 rounded">
              VITE_PLAUSIBLE_PUBLIC_URL
            </code>{" "}
            in your Vercel project to see live traffic analytics here.
          </p>
        </div>
      )}
    </div>
  );
}

function EngagementSection({ stats }: DashboardProps) {
  const { recent, chartData } = stats;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-lg font-semibold text-rose-900">Engagement</h1>
        <p className="text-xs text-rose-400">
          A gentle look at how often people are using MoodDrop.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white/80 border border-rose-100 shadow-sm p-4 lg:col-span-2">
          <h2 className="text-xs font-semibold text-rose-500 mb-3 uppercase tracking-[0.18em]">
            Mood Activity
          </h2>
          {chartData.length ? (
            <MoodChart data={chartData} />
          ) : (
            <p className="text-xs text-rose-400">
              Once more people share, you’ll see mood activity here.
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-white/80 border border-rose-100 shadow-sm p-4 space-y-3">
          <h2 className="text-xs font-semibold text-rose-500 mb-1 uppercase tracking-[0.18em]">
            Recent Activity
          </h2>
          {recent.length ? (
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {recent.map((d, idx) => {
                const ts = getTimestamp(d);
                const date = ts
                  ? new Date(ts).toLocaleTimeString()
                  : "Unknown time";
                const mood = getMood(d) || "unknown";

                return (
                  <li
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-rose-50/80 border border-rose-100 px-3 py-2"
                  >
                    <span className="text-[11px] capitalize text-rose-700">
                      {mood}
                    </span>
                    <span className="text-[10px] text-rose-400">{date}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-xs text-rose-400">
              Activity details will show here as people begin to post.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

type SettingsProps = {
  flags: Record<string, boolean>;
  onFlagChange: (key: string, value: boolean) => void;
  onExport: () => void;
  onImport: (e: ChangeEvent<HTMLInputElement>) => void;
};

function SettingsSection({
  flags,
  onFlagChange,
  onExport,
  onImport,
}: SettingsProps) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-lg font-semibold text-rose-900">Settings</h1>
        <p className="text-xs text-rose-400">
          Feature toggles and data tools for your space.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/80 border border-rose-100 shadow-sm p-4 space-y-3">
          <h2 className="text-xs font-semibold text-rose-500 mb-1 uppercase tracking-[0.18em]">
            Feature Toggles
          </h2>
          <div className="space-y-2 text-xs">
            <FlagToggle
              label="Voice Notes"
              description="Enable voice note experiments."
              value={!!flags.enableVoiceNotes}
              onChange={(v) => onFlagChange("enableVoiceNotes", v)}
            />
            <FlagToggle
              label="Mood Garden"
              description="Show Mood Garden tab (when ready)."
              value={!!flags.showMoodGardenTab}
              onChange={(v) => onFlagChange("showMoodGardenTab", v)}
            />
            <FlagToggle
              label="Affirmations"
              description="Enable daily affirmation features."
              value={!!flags.enableAffirmations}
              onChange={(v) => onFlagChange("enableAffirmations", v)}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 border border-rose-100 shadow-sm p-4 space-y-3">
          <h2 className="text-xs font-semibold text-rose-500 mb-1 uppercase tracking-[0.18em]">
            Data Tools
          </h2>
          <p className="text-[11px] text-rose-500 mb-2">
            Export your admin history or merge in CSV data.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={onExport}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 hover:bg-rose-100 transition"
            >
              Export CSV
            </button>

            <label className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 hover:bg-rose-100 transition cursor-pointer">
              Import CSV
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={onImport}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-[10px] text-rose-400">
            CSV format: "date","mood","text".
          </p>
        </div>
      </section>
    </div>
  );
}

type DangerProps = {
  onClearAll: () => void;
};

function DangerSection({ onClearAll }: DangerProps) {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-red-700">Danger Zone</h1>
        <p className="text-xs text-red-400">
          Destructive actions. Take a breath before you tap anything here.
        </p>
      </header>

      <div className="rounded-2xl border border-red-100 bg-red-50/70 shadow-sm p-4 space-y-3 text-xs text-red-700">
        <p className="font-semibold">Delete all local admin drops</p>
        <p className="text-[11px] text-red-500">
          This only clears the localStorage history used for admin stats and
          CSV export. It does <span className="font-semibold">not</span> delete
          anything in Supabase.
        </p>
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-red-700 transition"
        >
          Delete ALL local drops
        </button>
      </div>
    </div>
  );
}

/* --- Small stat card helper --- */

type StatCardProps = {
  title: string;
  value: string;
  hint?: string;
};

function StatCard({ title, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white/80 border border-rose-100 shadow-sm px-4 py-3 flex flex-col gap-1">
      <div className="text-[11px] uppercase tracking-[0.18em] text-rose-400">
        {title}
      </div>
      <div className="text-base font-semibold text-rose-900">{value}</div>
      {hint && (
        <div className="text-[11px] text-rose-400">
          {hint}
        </div>
      )}
    </div>
  );
}
