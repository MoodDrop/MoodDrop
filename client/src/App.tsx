// client/src/App.tsx
import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { readFlags } from "@/lib/featureFlags";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import ThankYou from "@/pages/thank-you";
import MyDropsPage from "@/pages/MyDropsPage";
import DropItPage from "@/pages/DropItPage";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import AdminPage from "@/pages/AdminPage";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import QAPage from "@/pages/QAPage";
import ContactPage from "@/pages/ContactPage";
import LivingGalleryPage from "@/pages/LivingGalleryPage";

// Owner unlock
import OwnerUnlockPage from "@/pages/OwnerUnlockPage";

// Soft Reads
import SoftReadsPage from "@/pages/SoftReadsPage";
import SoftReadPostPage from "@/pages/SoftReadPostPage";

// Playground
import CanvasPlayground from "@/pages/CanvasPlayground";

// Layout
import Header from "@/components/header";
import Footer from "@/components/footer";
import GhostMenu from "@/components/GhostMenu";

// Echo Vault
import EchoVaultPage from "@/pages/EchoVaultPage";

// Release Ritual
import ReleaseTextPage from "@/pages/ReleaseTextPage";
import ReleaseVoicePage from "@/pages/ReleaseVoicePage";

// Harmony
import HarmonyLandingPage from "@/pages/HarmonyLandingPage";
import HarmonyRequestPage from "@/pages/HarmonyRequestPage";
import HarmonyConfirmPage from "@/pages/HarmonyConfirmPage";

// Analytics
import { Analytics } from "@vercel/analytics/react";

function CalmStudioInlinePage() {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [lights, setLights] = React.useState<
    { id: number; x: number; y: number; size: number }[]
  >([]);

  const handleLightGardenClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newLight = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: 28 + Math.random() * 24,
    };

    setLights((prev) => [...prev, newLight]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-10">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-blush-100 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-warm-gray-700">
          Calm Studio
        </h1>
        <p className="text-warm-gray-600 text-sm sm:text-base mt-2 leading-6">
          This space is currently being prepared.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-blush-100 mb-8">
        <div className="rounded-xl border border-blush-100 bg-blush-50/60 p-4">
          <p className="text-warm-gray-700 font-semibold">
            Calm Studio is on the way 🌿
          </p>
          <p className="text-warm-gray-600 text-sm leading-6 mt-2">
            We&apos;re building a quiet space for breathing, soothing sounds,
            gentle visuals, and calming interactions.
          </p>
          <p className="text-warm-gray-500 text-xs italic mt-3">
            Quietly being crafted.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          type="button"
          onClick={() => setActiveSection("breath")}
          className={`rounded-2xl border p-5 shadow-sm text-left transition-all ${
            activeSection === "breath"
              ? "border-blush-200 bg-white shadow-md"
              : "border-blush-100 bg-white"
          }`}
        >
          <h2 className="text-base sm:text-lg font-semibold text-warm-gray-700">
            Take a Breath
          </h2>
          <p className="mt-2 text-sm leading-6 text-warm-gray-600">
            A small pause for your body and mind.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("visuals")}
          className={`rounded-2xl border p-5 shadow-sm text-left transition-all ${
            activeSection === "visuals"
              ? "border-blush-200 bg-white shadow-md"
              : "border-blush-100 bg-white"
          }`}
        >
          <h2 className="text-base sm:text-lg font-semibold text-warm-gray-700">
            Soft Visuals
          </h2>
          <p className="mt-2 text-sm leading-6 text-warm-gray-600">
            Gentle moments for when your mind needs less noise.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("sounds")}
          className={`rounded-2xl border p-5 shadow-sm text-left transition-all ${
            activeSection === "sounds"
              ? "border-blush-200 bg-white shadow-md"
              : "border-blush-100 bg-white"
          }`}
        >
          <h2 className="text-base sm:text-lg font-semibold text-warm-gray-700">
            Soothing Sounds
          </h2>
          <p className="mt-2 text-sm leading-6 text-warm-gray-600">
            Let the room soften around you.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("gentle-play")}
          className={`rounded-2xl border p-5 shadow-sm text-left transition-all ${
            activeSection === "gentle-play"
              ? "border-blush-200 bg-white shadow-md"
              : "border-blush-100 bg-white"
          }`}
        >
          <h2 className="text-base sm:text-lg font-semibold text-warm-gray-700">
            Gentle Play
          </h2>
          <p className="mt-2 text-sm leading-6 text-warm-gray-600">
            Quiet interaction for restless moments.
          </p>
        </button>
      </div>

      {activeSection === "breath" && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-blush-100 mb-8">
          <h3 className="text-lg font-semibold text-warm-gray-700 mb-2">
            Take a Breath
          </h3>
          <p className="text-warm-gray-600 text-sm leading-6">
            A breathing orb will live here next.
          </p>
        </section>
      )}

      {activeSection === "visuals" && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-blush-100 mb-8">
          <h3 className="text-lg font-semibold text-warm-gray-700 mb-2">
            Soft Visuals
          </h3>
          <p className="text-warm-gray-600 text-sm leading-6">
            Gentle calming visuals will live here next.
          </p>
        </section>
      )}

      {activeSection === "sounds" && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-blush-100 mb-8">
          <h3 className="text-lg font-semibold text-warm-gray-700 mb-2">
            Soothing Sounds
          </h3>
          <p className="text-warm-gray-600 text-sm leading-6">
            Ambient sound experiences will live here next.
          </p>
        </section>
      )}

      {activeSection === "gentle-play" && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-blush-100 mb-10">
          <h3 className="text-lg font-semibold text-warm-gray-700 mb-2">
            Light Garden
          </h3>
          <p className="text-warm-gray-600 text-sm leading-6 mb-5 max-w-2xl">
            Tap anywhere to place soft glowing lights and slowly fill the space
            with calm.
          </p>

          <div
            onClick={handleLightGardenClick}
            className="relative overflow-hidden rounded-[28px] border border-blush-100 min-h-[360px] cursor-pointer bg-gradient-to-b from-[#231f3f] via-[#30295a] to-[#43346d]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)] pointer-events-none" />

            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs tracking-wide text-white/80 uppercase z-10">
              Tap to place light
            </div>

            {lights.map((light) => (
              <span
                key={light.id}
                className="absolute rounded-full pointer-events-none animate-pulse"
                style={{
                  left: light.x,
                  top: light.y,
                  width: `${light.size}px`,
                  height: `${light.size}px`,
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, rgba(255,243,176,1) 0%, rgba(255,213,128,0.9) 40%, rgba(255,213,128,0.18) 72%, rgba(255,213,128,0) 100%)",
                  boxShadow:
                    "0 0 16px rgba(255,223,140,0.8), 0 0 34px rgba(255,223,140,0.35)",
                  animationDuration: "2.8s",
                }}
              />
            ))}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-white/75 z-10">
              A quiet little moment to build your own glow
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Router() {
  const flags = readFlags();

  return (
    <Switch>
      <Route path="/" component={Home} />

      <Route path="/owner-unlock" component={OwnerUnlockPage} />

      <Route path="/release/text" component={ReleaseTextPage} />
      <Route path="/release/voice" component={ReleaseVoicePage} />

      <Route path="/vault" component={EchoVaultPage} />

      <Route path="/living-gallery" component={LivingGalleryPage} />

      <Route path="/harmony" component={HarmonyLandingPage} />
      <Route path="/harmony/request" component={HarmonyRequestPage} />
      <Route path="/harmony/confirm" component={HarmonyConfirmPage} />

      <Route path="/playground" component={CanvasPlayground} />

      <Route path="/dashboard" component={Dashboard} />

      {/* Calm Studio */}
      <Route path="/comfort" component={CalmStudioInlinePage} />
      <Route path="/calm-studio" component={CalmStudioInlinePage} />

      <Route path="/my-drops" component={MyDropsPage} />
      <Route path="/drop-it" component={DropItPage} />

      <Route path="/soft-reads" component={SoftReadsPage} />
      <Route path="/soft-reads/:slug" component={SoftReadPostPage} />

      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/qa" component={QAPage} />
      <Route path="/contact" component={ContactPage} />

      <Route path="/admin" component={AdminPage} />
      <Route path="/admin-legacy" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />

      <Route path="/thank-you" component={ThankYou} />

      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();

  const isFullWidthPage =
    location === "/dashboard" ||
    location === "/calm-studio" ||
    location === "/comfort" ||
    location === "/soft-reads" ||
    location === "/playground" ||
    location === "/vault" ||
    location === "/living-gallery" ||
    location === "/harmony" ||
    location.startsWith("/harmony/") ||
    location.startsWith("/soft-reads/");

  const isHome = location === "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-cream-50 to-blush-100">
      <GhostMenu />

      {!isHome && <Header />}

      <main
        className={isFullWidthPage ? "px-6 py-8" : "max-w-lg mx-auto px-6 py-8"}
      >
        <Router />
      </main>

      <Footer />
      <Analytics />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;