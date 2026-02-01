// client/src/pages/OwnerUnlockPage.tsx
import { useMemo, useState } from "react";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const OWNER_KEY_STORAGE = "mooddrop_owner_key";

export default function OwnerUnlockPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [keyInput, setKeyInput] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const trimmed = useMemo(() => keyInput.trim(), [keyInput]);

  const trustThisDevice = async () => {
    if (!trimmed) {
      toast({
        title: "Missing key",
        description: "Please enter your owner key to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);

    try {
      // Store locally on this device
      localStorage.setItem(OWNER_KEY_STORAGE, trimmed);

      // Verify quietly with server
      const res = await fetch("/api/admin/verify", {
        method: "GET",
        headers: { "x-admin-key": trimmed },
      });

      if (!res.ok) {
        // Fail closed: remove bad key and redirect home
        localStorage.removeItem(OWNER_KEY_STORAGE);

        toast({
          title: "Not recognized",
          description:
            "That key didn’t match. This device was not trusted.",
          variant: "destructive",
        });

        // Calm exit
        window.location.replace("/");
        return;
      }

      toast({
        title: "Device trusted",
        description: "Entering The Quiet Room…",
      });

      // Go to admin
      setLocation("/admin");
    } catch {
      localStorage.removeItem(OWNER_KEY_STORAGE);
      window.location.replace("/");
    } finally {
      setIsChecking(false);
    }
  };

  const clearTrust = () => {
    localStorage.removeItem(OWNER_KEY_STORAGE);
    toast({
      title: "Trust cleared",
      description: "This device is no longer trusted for owner access.",
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe4ec_0,_#ffffff_45%,_#ffe4ec_100%)]">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-6 py-10">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100/70 px-3 py-1 text-xs font-medium text-rose-700">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Owner Access
          </div>

          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Unlock
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            This page is for trusting <span className="italic">your device</span> — not for
            user login. Enter your owner key to quietly open The Quiet Room.
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Owner key
          </label>

          <input
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Enter your owner key"
            autoComplete="off"
            className="mt-2 w-full rounded-xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-rose-200"
          />

          <button
            onClick={trustThisDevice}
            disabled={isChecking}
            className="mt-4 w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
          >
            {isChecking ? "Checking…" : "Trust this device"}
          </button>

          <button
            onClick={clearTrust}
            type="button"
            className="mt-3 w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
          >
            Clear trust on this device
          </button>

          <div className="mt-4 text-center">
            <Link href="/">
              <button className="text-sm text-rose-600 hover:text-rose-700">
                ← Back to MoodDrop
              </button>
            </Link>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Tip: Bookmark <span className="font-medium">/unlock</span> on your phone.
        </p>
      </div>
    </div>
  );
}
