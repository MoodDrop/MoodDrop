// client/src/pages/AdminPage.tsx

import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Settings,
  AlertTriangle,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { MoodChart } from "@/components/admin/MoodChart";
import { FlagToggle } from "@/components/Admin/FlagToggle";
import { readFlags, setFlag } from "@/lib/featureFlags";
import { supabase } from "@/lib/supabaseClient";

type AdminSection = "overview" | "traffic" | "settings";

type SavedDrop = {
  id: string;
  content: string | null;
  vibe_id: string | null;
  created_at: string;
};

type FeatureFlags = Record<string, boolean>;

const PLAUSIBLE_EMBED_URL = import.meta.env.VITE_PLAUSIBLE_EMBED_URL;

export default function AdminPage() {
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  const [recentDrops, setRecentDrops] = useState<SavedDrop[]>([]);
  const [isLoadingDrops, setIsLoadingDrops] = useState(false);
  const [dropsError, setDropsError] = useState<string | null>(null);

  const [flags, setFlags] = useState<FeatureFlags>({});
  const [isLoadingFlags, setIsLoadingFlags] = useState(true);

  // ---- Load feature flags on mount ----
  useEffect(() => {
    const loadFlags = async () => {
      try {
        const stored = await readFlags();
        setFlags(stored ?? {});
      } catch (error) {
        console.error("Error reading feature flags", error);
        toast({
          title: "Error loading settings",
          description: "Feature toggles could not be loaded.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingFlags(false);
      }
    };

    loadFlags();
  }, [toast]);

  const handleFlagChange = async (key: string, value: boolean) => {
    try {
      setFlags((prev) => ({ ...prev, [key]: value }));
      await setFlag(key, value);
      toast({
        title: "Setting updated",
        description: `"${key}" has been ${value ? "enabled" : "disabled"}.`,
      });
    } catch (error) {
      console.error("Error updating flag", error);
      toast({
        title: "Error updating setting",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  // ---- Load recent drops (Supabase) ----
  useEffect(() => {
    const loadDrops = async () => {
      setIsLoadingDrops(true);
      setDropsError(null);

      // IMPORTANT FIX: use lowercase table name "drops"
      const { data, error } = await supabase
        .from("drops")
        .select("id, content, vibe_id, created_at")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error loading drops", error);
        setDropsError(error.message);
        toast({
          title: "Error loading drops",
          description: "Admin could not fetch the latest drops.",
          variant: "destructive",
        });
      } else {
        setRecentDrops(data ?? []);
      }

      setIsLoadingDrops(false);
    };

    loadDrops();
  }, [toast]);

  const totalDrops = useMemo(() => recentDrops.length, [recentDrops]);

  // Overview stat placeholders – can be wired to real analytics later
  const totalVisits = 0; // placeholder
  const activeUsers7d = 0; // placeholder

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe4ec_0,_#ffffff_45%,_#ffe4ec_100%)]">
      {/* Layout A: wide, centered canvas */}
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        {/* Top header */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100/70 px-3 py-1 text-xs font-medium text-rose-700">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Owner Mode — MoodDrop Admin
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Soft, simple overview of how MoodDrop is flowing — visits, drops,
              and feature controls.
            </p>
          </div>

          <Link href="/">
            <button className="rounded-full border border-rose-100 bg-white px-4 py-2 text-xs font-medium text-rose-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50">
              ← Back to MoodDrop
            </button>
          </Link>
        </header>

        {/* Tabs */}
        <nav className="mb-6 flex gap-2 overflow-x-auto rounded-full bg-white/70 p-1 text-sm shadow-sm backdrop-blur">
          <TabButton
            icon={LayoutDashboard}
            label="Overview"
            isActive={activeSection === "overview"}
            onClick={() => setActiveSection("overview")}
          />
          <TabButton
            icon={BarChart3}
            label="Traffic"
            isActive={activeSection === "traffic"}
            onClick={() => setActiveSection("traffic")}
          />
          <TabButton
            icon={Settings}
            label="Settings"
            isActive={activeSection === "settings"}
            onClick={() => setActiveSection("settings")}
          />
        </nav>

        {/* Main content */}
        <main className="flex-1">
          {activeSection === "overview" && (
            <OverviewSection
              totalVisits={totalVisits}
              totalDrops={totalDrops}
              activeUsers7d={activeUsers7d}
              isLoadingDrops={isLoadingDrops}
              dropsError={dropsError}
              recentDrops={recentDrops}
            />
          )}

          {activeSection === "traffic" && (
            <TrafficSection plausibleUrl={PLAUSIBLE_EMBED_URL} />
          )}

          {activeSection === "settings" && (
            <SettingsSection
              flags={flags}
              isLoadingFlags={isLoadingFlags}
              onFlagChange={handleFlagChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ----------------- Sub-components -----------------

type TabButtonProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
};

function TabButton({ icon: Icon, label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${
        isActive
          ? "bg-rose-600 text-white shadow-sm"
          : "bg-transparent text-slate-600 hover:bg-rose-50"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

type OverviewProps = {
  totalVisits: number;
  totalDrops: number;
  activeUsers7d: number;
  isLoadingDrops: boolean;
  dropsError: string | null;
  recentDrops: SavedDrop[];
};

function OverviewSection({
  totalVisits,
  totalDrops,
  activeUsers7d,
  isLoadingDrops,
  dropsError,
  recentDrops,
}: OverviewProps) {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Visits
            </span>
            <Activity className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {totalVisits.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Connected to Plausible (coming soon).
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Drops (sample)
            </span>
            <LayoutDashboard className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {totalDrops.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Based on the recent drops loaded here.
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Active users (7d)
            </span>
            <BarChart3 className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {activeUsers7d.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Placeholder for future analytics.
          </p>
        </div>
      </div>

      {/* Middle row: Mood chart + recent drops */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1.3fr)]">
        {/* Mood activity chart */}
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Mood Activity
              </h2>
              <p className="text-xs text-slate-500">
                Soft snapshot of how emotions are flowing in The Collective
                Drop.
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-rose-50/60 p-3">
           <div className="h-40 flex items-center justify-center text-xs text-slate-400">
  Mood chart coming soon…
</div>
          </div>
        </div>

        {/* Recent drops list */}
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Drops
              </h2>
              <p className="text-xs text-slate-500">
                Quick peek at what your community is sharing (anonymous).
              </p>
            </div>
          </div>

          {isLoadingDrops && (
            <p className="text-xs text-slate-500">Loading drops…</p>
          )}

          {dropsError && !isLoadingDrops && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <div>
                <p className="font-medium">Error loading drops</p>
                <p className="text-[11px] text-rose-600/80">
                  {dropsError}
                </p>
              </div>
            </div>
          )}

          {!isLoadingDrops && !dropsError && recentDrops.length === 0 && (
            <p className="text-xs text-slate-500">
              No drops found yet. Once people start sharing, you’ll see the most
              recent ones here.
            </p>
          )}

          <ul className="mt-2 space-y-2">
            {recentDrops.map((drop) => (
              <li
                key={drop.id}
                className="rounded-xl border border-rose-50 bg-rose-50/60 p-3 text-xs"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-rose-700">
                    💧 {drop.vibe_id ?? "Unknown Vibe"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(drop.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="line-clamp-3 text-slate-700">
                  {drop.content || "No text content"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

type TrafficProps = {
  plausibleUrl?: string;
};

function TrafficSection({ plausibleUrl }: TrafficProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">
          Traffic & Analytics
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          This panel is ready for Plausible. Once you add the embed URL to your
          <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-[10px]">
            .env.local
          </code>
          as{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-[10px]">
            VITE_PLAUSIBLE_EMBED_URL
          </code>
          , it will show live site analytics.
        </p>
      </div>

      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
        {plausibleUrl ? (
          <iframe
            src={plausibleUrl}
            title="MoodDrop Analytics"
            className="h-[480px] w-full rounded-xl border border-rose-100 bg-white"
          />
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-rose-200 bg-rose-50/50 text-center">
            <p className="text-sm font-medium text-slate-700">
              Plausible not connected yet
            </p>
            <p className="mt-1 max-w-xs text-xs text-slate-500">
              Add your Plausible embed URL to{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-[10px]">
                VITE_PLAUSIBLE_EMBED_URL
              </code>{" "}
              and redeploy to see traffic here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

type SettingsProps = {
  flags: FeatureFlags;
  isLoadingFlags: boolean;
  onFlagChange: (key: string, value: boolean) => void;
};

function SettingsSection({
  flags,
  isLoadingFlags,
  onFlagChange,
}: SettingsProps) {
  const featureList: { key: string; label: string; description: string }[] = [
    {
      key: "calmStudio",
      label: "Calm Studio",
      description: "Toggle access to the Calm Studio experience.",
    },
    {
      key: "collectiveDrop",
      label: "The Collective Drop",
      description: "Show or hide the anonymous community feed.",
    },
    {
      key: "replies",
      label: "Replies",
      description: "Allow users to reply to each other’s drops.",
    },
    {
      key: "reactions",
      label: "Reactions (Feels)",
      description: "Let users react with soft feels on each drop.",
    },
    {
      key: "moodHistory",
      label: "Mood History",
      description: "Enable any future mood history / timeline features.",
    },
    {
      key: "adminMode",
      label: "Admin Mode",
      description: "Gate admin access behind your secret passcode.",
    },
    {
      key: "vibeIdGenerator",
      label: "Vibe ID generator",
      description: "Control the Vibe ID name system site-wide.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Feature toggles */}
      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Feature toggles</h2>
        <p className="mt-1 text-xs text-slate-500">
          Turn MoodDrop features on or off without touching code. Changes apply
          the next time users visit the site.
        </p>

        {isLoadingFlags ? (
          <p className="mt-3 text-xs text-slate-500">Loading toggles…</p>
        ) : (
          <div className="mt-4 space-y-3">
            {featureList.map((feature) => (
              <FlagToggle
                key={feature.key}
                label={feature.label}
                description={feature.description}
                checked={Boolean(flags[feature.key])}
                onChange={(value: boolean) =>
                  onFlagChange(feature.key, value)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Data tools */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Data tools</h3>
          <p className="mt-1 text-xs text-slate-500">
            Light tools to help you manage data and debugging while developing
            MoodDrop.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <button
              className="rounded-full bg-rose-600 px-3 py-1.5 font-medium text-white shadow-sm hover:bg-rose-700"
              onClick={() => {
                console.log("[Admin] Export CSV clicked");
                // TODO: implement CSV export
              }}
            >
              Export CSV
            </button>
            <button
              className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 font-medium text-rose-700 hover:bg-rose-100"
              onClick={() => {
                console.log("[Admin] Clear local My Drops clicked");
                // TODO: implement local My Drops clear
              }}
            >
              Clear local My Drops
            </button>
            <button
              className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 font-medium text-rose-700 hover:bg-rose-100"
              onClick={() => {
                console.log("[Admin] Refresh Vibe ID list clicked");
                // TODO: implement Vibe ID refresh
              }}
            >
              Refresh Vibe ID list
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/80 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-700" />
            <h3 className="text-sm font-semibold text-rose-800">
              Danger zone
            </h3>
          </div>
          <p className="text-xs text-rose-700/90">
            Heavy actions for testing or emergencies. These will eventually be
            wired to real destructive operations, so use carefully.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <button
              className="rounded-full bg-rose-700 px-3 py-1.5 font-medium text-rose-50 shadow-sm hover:bg-rose-800"
              onClick={() => {
                console.log("[Admin] Delete all drops clicked");
                // TODO: implement delete all drops
              }}
            >
              Delete all drops
            </button>
            <button
              className="rounded-full border border-rose-300 bg-rose-100 px-3 py-1.5 font-medium text-rose-800 hover:bg-rose-200"
              onClick={() => {
                console.log("[Admin] Reset admin mode clicked");
                // TODO: implement reset admin mode
              }}
            >
              Reset admin mode
            </button>
            <button
              className="rounded-full border border-rose-300 bg-rose-100 px-3 py-1.5 font-medium text-rose-800 hover:bg-rose-200"
              onClick={() => {
                console.log("[Admin] Clear analytics cache clicked");
                // TODO: implement clear analytics cache
              }}
            >
              Clear analytics cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
