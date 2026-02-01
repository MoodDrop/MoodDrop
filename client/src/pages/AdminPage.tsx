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
import { FlagToggle } from "@/components/Admin/FlagToggle";
import { readFlags, setFlag, type FeatureFlags } from "@/lib/featureFlags";
import { supabase } from "@/lib/supabaseClient";

type AdminSection = "overview" | "traffic" | "settings";

type SavedDrop = {
  id: string;
  mood: string | null;
  created_at: string;
};

const PLAUSIBLE_EMBED_URL = import.meta.env.VITE_PLAUSIBLE_EMBED_URL;

// Optional: if you want a button that jumps straight to Vercel analytics
const VERCEL_ANALYTICS_URL = import.meta.env.VITE_VERCEL_ANALYTICS_URL;

// LocalStorage key name for your trusted device token
const OWNER_KEY_STORAGE = "mooddrop_owner_key";

export default function AdminPage() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  // 🔒 Access gate state
  const [isVerifying, setIsVerifying] = useState(true);

  // Data
  const [recentDrops, setRecentDrops] = useState<SavedDrop[]>([]);
  const [isLoadingDrops, setIsLoadingDrops] = useState(false);
  const [dropsError, setDropsError] = useState<string | null>(null);

  // Feature flags (localStorage — instant)
  const [flags, setFlags] = useState<FeatureFlags>(() => readFlags());

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
          window.location.replace("/");
          return;
        }

        setIsVerifying(false);
      } catch {
        window.location.replace("/");
      }
    };

    verify();
  }, []);

  const handleFlagChange = (key: keyof FeatureFlags, value: boolean) => {
    try {
      setFlags((prev) => ({ ...prev, [key]: value }));
      setFlag(key, value);

      toast({
        title: "Setting updated",
        description: `"${String(key)}" has been ${
          value ? "enabled" : "disabled"
        }.`,
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
        .limit(12);

      if (error) {
        console.error("Error loading drops", error);
        setDropsError(error.message);
        toast({
          title: "Error loading echoes",
          description: "The Quiet Room could not fetch the latest echoes.",
          variant: "destructive",
        });
      } else {
        setRecentDrops((data as SavedDrop[]) ?? []);
      }

      setIsLoadingDrops(false);
    };

    if (!isVerifying) loadDrops();
  }, [toast, isVerifying]);

  const totalEchoesLoaded = useMemo(() => recentDrops.length, [recentDrops]);

  // Placeholder values for now (until analytics is wired)
  const totalFootsteps = 0;
  const active7d = 0;

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
              totalFootsteps={totalFootsteps}
              echoesLoaded={totalEchoesLoaded}
              activeUsers7d={active7d}
              isLoadingDrops={isLoadingDrops}
              dropsError={dropsError}
              recentDrops={recentDrops}
            />
          )}

          {activeSection === "traffic" && (
            <FootstepsSection
              plausibleUrl={PLAUSIBLE_EMBED_URL}
              vercelUrl={VERCEL_ANALYTICS_URL}
            />
          )}

          {activeSection === "settings" && (
            <SettingsSection flags={flags} onFlagChange={handleFlagChange} />
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
  totalFootsteps: number;
  echoesLoaded: number;
  activeUsers7d: number;
  isLoadingDrops: boolean;
  dropsError: string | null;
  recentDrops: SavedDrop[];
};

function OverviewSection({
  totalFootsteps,
  echoesLoaded,
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
            {totalFootsteps.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Connect analytics when you’re ready (Vercel is easiest).
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Echoes held (loaded)
            </span>
            <LayoutDashboard className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {echoesLoaded.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            This is only what’s loaded in this panel right now.
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

      {/* Atmosphere + Recent Echoes */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1.3fr)]">
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Atmosphere</h2>
          <p className="mt-1 text-xs text-slate-500">
            A soft snapshot of what’s most common — no harsh metrics.
          </p>
          <div className="mt-3 rounded-xl bg-rose-50/60 p-3">
            <div className="flex h-40 items-center justify-center text-xs text-slate-400">
              Atmosphere view coming soon…
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Recent Echoes</h2>
          <p className="mt-1 text-xs text-slate-500">
            A gentle peek — collapsed by nature, not performative.
          </p>

          {isLoadingDrops && (
            <p className="mt-3 text-xs text-slate-500">Loading…</p>
          )}

          {dropsError && !isLoadingDrops && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
              <AlertTriangle className="mt-0.5 h-4 w-4" />
              <div>
                <p className="font-medium">Couldn’t load recent echoes</p>
                <p className="text-[11px] text-rose-600/80">{dropsError}</p>
              </div>
            </div>
          )}

          {!isLoadingDrops && !dropsError && recentDrops.length === 0 && (
            <p className="mt-3 text-xs text-slate-500">
              No echoes found yet. When people begin releasing, the newest ones
              will appear here.
            </p>
          )}

          <ul className="mt-3 space-y-2">
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
  plausibleUrl,
  vercelUrl,
}: {
  plausibleUrl?: string;
  vercelUrl?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Footsteps</h2>
        <p className="mt-1 text-xs text-slate-500">
          Footsteps reflect how people find their way to MoodDrop. This view is
          intentionally high-level — designed to observe arrival, not behavior.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-xs">
            <p className="font-semibold text-slate-900">Instagram</p>
            <p className="mt-1 text-slate-600">Shared links and profile visits</p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-xs">
            <p className="font-semibold text-slate-900">Direct</p>
            <p className="mt-1 text-slate-600">Typed links, bookmarks, or saved access</p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-xs">
            <p className="font-semibold text-slate-900">Search</p>
            <p className="mt-1 text-slate-600">Quiet discovery through search engines</p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-xs">
            <p className="font-semibold text-slate-900">Other paths</p>
            <p className="mt-1 text-slate-600">Mentions, shares, or external links</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Footsteps show how the sanctuary is being discovered — not what happens
          once someone arrives.
        </p>

        <div className="mt-4 rounded-2xl border border-rose-100 bg-white/70 p-4 text-xs">
          <p className="font-semibold text-slate-900">View full analytics in Vercel</p>
          <p className="mt-1 text-slate-600">
            Open your project’s Analytics tab to see referrers, top pages, and trends.
          </p>

          {vercelUrl ? (
            <a
              href={vercelUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex rounded-full bg-rose-600 px-4 py-2 text-[11px] font-medium text-white shadow-sm hover:bg-rose-700"
            >
              Open Vercel Analytics
            </a>
          ) : (
            <p className="mt-3 text-[11px] text-slate-500">
              Optional: add{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5">
                VITE_VERCEL_ANALYTICS_URL
              </code>{" "}
              to{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5">
                client/.env.local
              </code>{" "}
              to enable a direct button.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Optional: Plausible (later)</h3>
        <p className="mt-1 text-xs text-slate-500">
          If you decide to embed Plausible in the future, you can use{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-[10px]">
            VITE_PLAUSIBLE_EMBED_URL
          </code>
          . For now, Footsteps stays light and link-only.
        </p>

        {plausibleUrl ? (
          <iframe
            src={plausibleUrl}
            title="MoodDrop Analytics"
            className="mt-4 h-[480px] w-full rounded-xl border border-rose-100 bg-white"
          />
        ) : null}
      </div>
    </div>
  );
}

function SettingsSection({
  flags,
  onFlagChange,
}: {
  flags: FeatureFlags;
  onFlagChange: (key: keyof FeatureFlags, value: boolean) => void;
}) {
  const featureList = [
    {
      key: "enableVoiceNotes",
      label: "Voice Notes",
      description: "Allow voice releases.",
    },
    {
      key: "showMoodGardenTab",
      label: "Mood Garden",
      description: "Show Mood Garden tab.",
    },
    {
      key: "enableAffirmations",
      label: "Affirmations",
      description: "Enable affirmations.",
    },
    {
      key: "communityEnabled",
      label: "Community",
      description: "Enable community features.",
    },
  ] as const satisfies ReadonlyArray<{
    key: keyof FeatureFlags;
    label: string;
    description: string;
  }>;

  return (
    <div className="space-y-3">
      {featureList.map((feature) => (
        <FlagToggle
          key={feature.key}
          label={feature.label}
          description={feature.description}
          enabled={Boolean(flags[feature.key])}
          onChange={(value: boolean) => onFlagChange(feature.key, value)}
        />
      ))}
    </div>
  );
}
