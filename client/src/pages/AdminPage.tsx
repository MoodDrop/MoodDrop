// client/src/pages/AdminPage.tsx

import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Settings,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { FlagToggle } from "@/components/Admin/FlagToggle";
import { readFlags, setFlag } from "@/lib/featureFlags";
import { supabase } from "@/lib/supabaseClient";

type AdminSection = "overview" | "traffic" | "settings";

type SavedDrop = {
  id: string;
  mood: string | null;
  created_at: string;
};

type FeatureFlags = Record<string, boolean>;

// (Optional for later) Keeping this in case you revisit Plausible.
const PLAUSIBLE_EMBED_URL = import.meta.env.VITE_PLAUSIBLE_EMBED_URL;

// Optional: set this in client/.env.local later to enable a direct link button.
// Example:
// VITE_VERCEL_ANALYTICS_URL=https://vercel.com/<team-or-user>/<project>/analytics
const VERCEL_ANALYTICS_URL = import.meta.env.VITE_VERCEL_ANALYTICS_URL as
  | string
  | undefined;

// LocalStorage key name for your trusted device token
const OWNER_KEY_STORAGE = "mooddrop_owner_key";

export default function AdminPage() {
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  // 🔒 Access gate state
  const [isVerifying, setIsVerifying] = useState(true);

  const [recentDrops, setRecentDrops] = useState<SavedDrop[]>([]);
  const [isLoadingDrops, setIsLoadingDrops] = useState(false);
  const [dropsError, setDropsError] = useState<string | null>(null);

  const [flags, setFlags] = useState<FeatureFlags>({});
  const [isLoadingFlags, setIsLoadingFlags] = useState(true);

  // -----------------------------
  // 🔒 Quiet Room verification
  // -----------------------------
  useEffect(() => {
    const verify = async () => {
      try {
        const ownerKey = localStorage.getItem(OWNER_KEY_STORAGE);

        // No key on this device = instant redirect
        if (!ownerKey) {
          window.location.replace("/");
          return;
        }

        const res = await fetch("/api/admin/verify", {
          method: "GET",
          headers: {
            "x-admin-key": ownerKey,
          },
        });

        if (!res.ok) {
          // Wrong/expired key = instant redirect
          window.location.replace("/");
          return;
        }

        // Authorized
        setIsVerifying(false);
      } catch (err) {
        // Any failure = fail closed
        window.location.replace("/");
      }
    };

    verify();
  }, []);

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

    // Only load flags after verification is complete
    if (!isVerifying) loadFlags();
  }, [toast, isVerifying]);

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

      const { data, error } = await supabase
        .from("drops")
        .select("id, mood, created_at")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error loading drops", error);
        setDropsError(error.message);
        toast({
          title: "Error loading drops",
          description: "Quiet Room could not fetch the latest drops.",
          variant: "destructive",
        });
      } else {
        setRecentDrops((data as SavedDrop[]) ?? []);
      }

      setIsLoadingDrops(false);
    };

    // Only load after verification is complete
    if (!isVerifying) loadDrops();
  }, [toast, isVerifying]);

  const totalDrops = useMemo(() => recentDrops.length, [recentDrops]);

  // Overview stat placeholders – can be wired to real analytics later
  const totalVisits = 0; // placeholder
  const activeUsers7d = 0; // placeholder

  // While verifying, show nothing "helpful" (no hints). Keep it calm.
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe4ec_0,_#ffffff_45%,_#ffe4ec_100%)]">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-5 py-4 shadow-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-rose-400" />
            <p className="text-xs text-slate-600">Entering…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe4ec_0,_#ffffff_45%,_#ffe4ec_100%)]">
      {/* Layout A: wide, centered canvas */}
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        {/* Top header */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100/70 px-3 py-1 text-xs font-medium text-rose-700">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Owner Mode — The Quiet Room
            </div>

            <h1 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              The Quiet Room
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              A calm place to observe MoodDrop’s pulse — gently, privately, and
              without noise.
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
            label="Pulse"
            isActive={activeSection === "overview"}
            onClick={() => setActiveSection("overview")}
          />
          <TabButton
            icon={BarChart3}
            label="Footsteps"
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
            <FootstepsSection vercelAnalyticsUrl={VERCEL_ANALYTICS_URL} />
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
              Footsteps
            </span>
            <Activity className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {totalVisits.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Vercel Analytics can be linked in Footsteps when you’re ready.
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Echoes Held (sample)
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
              Active (7d)
            </span>
            <BarChart3 className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {activeUsers7d.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Placeholder for privacy-first analytics.
          </p>
        </div>
      </div>

      {/* Middle row: Atmosphere placeholder + recent echoes */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1.3fr)]">
        {/* Atmosphere */}
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-slate-900">Atmosphere</h2>
            <p className="text-xs text-slate-500">
              A soft snapshot of what’s most common — no harsh metrics.
            </p>
          </div>
          <div className="rounded-xl bg-rose-50/60 p-3">
            <div className="flex h-40 items-center justify-center text-xs text-slate-400">
              Atmosphere view coming soon…
            </div>
          </div>
        </div>

        {/* Recent echoes */}
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Echoes
            </h2>
            <p className="text-xs text-slate-500">
              A gentle peek — collapsed by nature, not performative.
            </p>
          </div>

          {isLoadingDrops && <p className="text-xs text-slate-500">Loading…</p>}

          {dropsError && !isLoadingDrops && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <div>
                <p className="font-medium">Couldn’t load recent echoes</p>
                <p className="text-[11px] text-rose-600/80">{dropsError}</p>
              </div>
            </div>
          )}

          {!isLoadingDrops && !dropsError && recentDrops.length === 0 && (
            <p className="text-xs text-slate-500">
              No drops found yet. When people begin releasing, the newest ones
              will appear here.
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
                    💗 echo
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(drop.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-700">
                  {drop.mood ? `Mood: ${drop.mood}` : "Mood: (unset)"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function FootstepsSection({
  vercelAnalyticsUrl,
}: {
  vercelAnalyticsUrl?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Footsteps</h2>

        <p className="mt-2 text-sm text-slate-600">
          Footsteps reflect how people find their way to MoodDrop. This view is
          intentionally high-level — designed to observe arrival, not behavior.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
            <p className="text-xs font-semibold text-slate-900">Instagram</p>
            <p className="mt-1 text-xs text-slate-600">
              Shared links and profile visits
            </p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
            <p className="text-xs font-semibold text-slate-900">Direct</p>
            <p className="mt-1 text-xs text-slate-600">
              Typed links, bookmarks, or saved access
            </p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
            <p className="text-xs font-semibold text-slate-900">Search</p>
            <p className="mt-1 text-xs text-slate-600">
              Quiet discovery through search engines
            </p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
            <p className="text-xs font-semibold text-slate-900">Other paths</p>
            <p className="mt-1 text-xs text-slate-600">
              Mentions, shares, or external links
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Footsteps show how the sanctuary is being discovered — not what happens
          once someone arrives.
        </p>

        <div className="mt-4">
          {vercelAnalyticsUrl ? (
            <a
              href={vercelAnalyticsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2 text-xs font-medium text-rose-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50"
            >
              View full analytics in Vercel <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <div className="rounded-2xl border border-rose-100 bg-white/70 p-4">
              <p className="text-xs font-medium text-slate-700">
                View full analytics in Vercel
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Optional: add{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-[10px]">
                  VITE_VERCEL_ANALYTICS_URL
                </code>{" "}
                to{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-[10px]">
                  client/.env.local
                </code>{" "}
                to enable a direct button link.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Keeping Plausible note for later (quiet, non-blocking) */}
      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
        <h3 className="text-xs font-semibold text-slate-900">
          Optional: Plausible (later)
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          If you decide to embed Plausible in the future, you can use{" "}
          <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-[10px]">
            VITE_PLAUSIBLE_EMBED_URL
          </code>
          . For now, Footsteps stays light and link-out only.
        </p>

        {PLAUSIBLE_EMBED_URL ? (
          <iframe
            src={PLAUSIBLE_EMBED_URL}
            title="MoodDrop Analytics"
            className="mt-3 h-[380px] w-full rounded-xl border border-rose-100 bg-white"
          />
        ) : null}
      </div>
    </div>
  );
}

type SettingsProps = {
  flags: FeatureFlags;
  isLoadingFlags: boolean;
  onFlagChange: (key: string, value: boolean) => void;
};

function SettingsSection({ flags, isLoadingFlags, onFlagChange }: SettingsProps) {
  // Removed Vibe ID controls and any “admin mode” wording
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
  ];

  return (
    <div className="space-y-6">
      {/* Feature toggles */}
      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Feature toggles</h2>
        <p className="mt-1 text-xs text-slate-500">
          Turn features on or off without touching code. Changes apply the next
          time users visit the site.
        </p>

        {isLoadingFlags ? (
          <p className="mt-3 text-xs text-slate-500">Loading…</p>
        ) : (
          <div className="mt-4 space-y-3">
            {featureList.map((feature) => (
              <FlagToggle
                key={feature.key}
                label={feature.label}
                description={feature.description}
                checked={Boolean(flags[feature.key])}
                onChange={(value: boolean) => onFlagChange(feature.key, value)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tools + Danger zone */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Tools</h3>
          <p className="mt-1 text-xs text-slate-500">
            Light tools for development and maintenance — kept gentle.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <button
              className="rounded-full bg-rose-600 px-3 py-1.5 font-medium text-white shadow-sm hover:bg-rose-700"
              onClick={() => {
                console.log("[Quiet Room] Export CSV clicked");
                // TODO: implement CSV export
              }}
            >
              Export CSV
            </button>
            <button
              className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 font-medium text-rose-700 hover:bg-rose-100"
              onClick={() => {
                console.log("[Quiet Room] Clear local My Drops clicked");
                // TODO: implement local My Drops clear
              }}
            >
              Clear local My Drops
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/80 p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-700" />
            <h3 className="text-sm font-semibold text-rose-800">Danger zone</h3>
          </div>
          <p className="text-xs text-rose-700/90">
            Heavy actions for testing or emergencies. Use carefully.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <button
              className="rounded-full bg-rose-700 px-3 py-1.5 font-medium text-rose-50 shadow-sm hover:bg-rose-800"
              onClick={() => {
                console.log("[Quiet Room] Delete all drops clicked");
                // TODO: implement delete all drops
              }}
            >
              Delete all drops
            </button>
            <button
              className="rounded-full border border-rose-300 bg-rose-100 px-3 py-1.5 font-medium text-rose-800 hover:bg-rose-200"
              onClick={() => {
                console.log("[Quiet Room] Clear analytics cache clicked");
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
