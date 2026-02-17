// client/src/App.tsx
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
import CalmStudio from "@/pages/CalmStudio";
import MyDropsPage from "@/pages/MyDropsPage";
import DropItPage from "@/pages/DropItPage";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import AdminPage from "@/pages/AdminPage";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import QAPage from "@/pages/QAPage";
import ContactPage from "@/pages/ContactPage";

// 🔓 Owner unlock page
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

// Calm Studio sub-route
import TakeABreath from "@/pages/take-a-breath";

// ✅ Reflections
import ReflectionsPage from "@/pages/ReflectionsPage";

// Vercel Analytics
import { Analytics } from "@vercel/analytics/react";

console.log("[MoodDrop] App.tsx mounted");

/**
 * Global time-of-day atmosphere (device local time only)
 * Morning (5-11): lighter cream
 * Afternoon (12-17): baseline rose milk
 * Evening (18-21): warmer blush
 * Night (22-4): deeper soft rose
 *
 * NOTE:
 * This uses existing Tailwind color tokens already in your app (blush/cream).
 * No tracking, no storage, no timezone logic beyond device local time.
 */
function getAtmosphereGradient() {
  const hour = new Date().getHours();

  // Morning: lighter, airy
  if (hour >= 5 && hour < 12) {
    return "bg-gradient-to-br from-cream-50 via-blush-50 to-cream-100";
  }

  // Afternoon: current default baseline
  if (hour >= 12 && hour < 18) {
    return "bg-gradient-to-br from-blush-50 via-cream-50 to-blush-100";
  }

  // Evening: warmer, softer
  if (hour >= 18 && hour < 22) {
    return "bg-gradient-to-br from-blush-100 via-blush-50 to-cream-50";
  }

  // Night: deeper, quieter
  return "bg-gradient-to-br from-blush-100 via-blush-100 to-blush-50";
}

function Router() {
  const flags = readFlags();
  console.log("[MoodDrop] Router initialized — feature flags:", flags);

  return (
    <Switch>
      {/* Home */}
      <Route path="/" component={Home} />

      {/* 🔓 Owner unlock (temporary but intentional) */}
      <Route path="/owner-unlock" component={OwnerUnlockPage} />

      {/* Release Ritual */}
      <Route path="/release/text" component={ReleaseTextPage} />
      <Route path="/release/voice" component={ReleaseVoicePage} />

      {/* Echo Vault */}
      <Route path="/vault" component={EchoVaultPage} />

      {/* ✅ Reflections */}
      <Route path="/reflections" component={ReflectionsPage} />

      {/* 🚫 Collective Drop disabled */}
      <Route path="/community">
        {() => {
          window.location.replace("/vault");
          return null;
        }}
      </Route>

      {/* Playground */}
      <Route path="/playground" component={CanvasPlayground} />

      {/* Dashboard */}
      <Route path="/dashboard" component={Dashboard} />

      {/* Calm Studio */}
      <Route path="/comfort" component={CalmStudio} />
      <Route path="/calm-studio" component={CalmStudio} />
      <Route path="/calm-studio/breathe" component={TakeABreath} />

      {/* 🌿 Mood Garden (retired) → redirect to Reflections */}
      <Route path="/garden">
        {() => {
          window.location.replace("/reflections");
          return null;
        }}
      </Route>

      {/* Legacy Drops */}
      <Route path="/my-drops" component={MyDropsPage} />
      <Route path="/drop-it" component={DropItPage} />

      {/* Soft Reads */}
      <Route path="/soft-reads" component={SoftReadsPage} />
      <Route path="/soft-reads/:slug" component={SoftReadPostPage} />

      {/* Static Pages */}
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/qa" component={QAPage} />
      <Route path="/contact" component={ContactPage} />

      {/* Admin */}
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin-legacy" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />

      {/* Thank You */}
      <Route path="/thank-you" component={ThankYou} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  console.log("[MoodDrop] Current route:", location);

  const atmosphereClass = getAtmosphereGradient();

  const isFullWidthPage =
    location === "/dashboard" ||
    location === "/calm-studio" ||
    location === "/comfort" ||
    location === "/soft-reads" ||
    location === "/playground" ||
    location === "/vault" ||
    location === "/reflections" ||
    location.startsWith("/soft-reads/");

  const isHome = location === "/";

  return (
    <div className={`min-h-screen ${atmosphereClass}`}>
      <GhostMenu />
      {!isHome && <Header />}

      <main className={isFullWidthPage ? "" : "max-w-lg mx-auto px-6 py-8"}>
        <Router />
      </main>

      <Footer />

      {/* Analytics */}
      <Analytics />
    </div>
  );
}

function App() {
  console.log("[MoodDrop] App() rendering...");
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
