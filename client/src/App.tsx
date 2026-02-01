// client/src/App.tsx
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { readFlags } from "@/lib/featureFlags";

// ✅ Vercel Analytics
import { Analytics } from "@vercel/analytics/react";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import ThankYou from "@/pages/thank-you";
import CalmStudio from "@/pages/CalmStudio";
import Garden from "@/pages/garden";
import MyDropsPage from "@/pages/MyDropsPage";
import DropItPage from "@/pages/DropItPage";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import AdminPage from "@/pages/AdminPage";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import QAPage from "@/pages/QAPage";
import ContactPage from "@/pages/ContactPage";

// ✅ Soft Reads
import SoftReadsPage from "@/pages/SoftReadsPage";
import SoftReadPostPage from "@/pages/SoftReadPostPage";

// 🧪 MoodCanvas Playground
import CanvasPlayground from "@/pages/CanvasPlayground";

import Header from "@/components/header";
import Footer from "@/components/footer";

// ✅ Ghost Navigation (global)
import GhostMenu from "@/components/GhostMenu";

// ✅ Echo Vault
import EchoVaultPage from "@/pages/EchoVaultPage";

// ✅ New Release Ritual pages
import ReleaseTextPage from "@/pages/ReleaseTextPage";
import ReleaseVoicePage from "@/pages/ReleaseVoicePage";

// ✅ Calm Studio sub-route only
import TakeABreath from "@/pages/take-a-breath";

console.log("[MoodDrop] App.tsx mounted");

function Router() {
  const flags = readFlags();
  console.log("[MoodDrop] Router initialized — feature flags:", flags);

  return (
    <Switch>
      {/* Home */}
      <Route path="/" component={Home} />

      {/* Release Ritual */}
      <Route path="/release/text" component={ReleaseTextPage} />
      <Route path="/release/voice" component={ReleaseVoicePage} />

      {/* Echo Vault */}
      <Route path="/vault" component={EchoVaultPage} />

      {/* 🚫 Collective Drop DISABLED — redirect to Echo Vault */}
      <Route path="/community">
        {() => {
          window.location.replace("/vault");
          return null;
        }}
      </Route>

      {/* Canvas Playground */}
      <Route path="/playground" component={CanvasPlayground} />

      {/* Dashboard */}
      <Route path="/dashboard" component={Dashboard} />

      {/* Calm Studio + Garden */}
      <Route path="/comfort" component={CalmStudio} />
      <Route path="/calm-studio" component={CalmStudio} />
      <Route path="/garden" component={Garden} />
      <Route path="/calm-studio/breathe" component={TakeABreath} />

      {/* Legacy Drops (kept but not primary) */}
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

  const isFullWidthPage =
    location === "/garden" ||
    location === "/dashboard" ||
    location === "/calm-studio" ||
    location === "/comfort" ||
    location === "/soft-reads" ||
    location === "/playground" ||
    location === "/vault" ||
    location.startsWith("/soft-reads/");

  const isHome = location === "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-cream-50 to-blush-100">
      <GhostMenu />
      {!isHome && <Header />}

      <main className={isFullWidthPage ? "" : "max-w-lg mx-auto px-6 py-8"}>
        <Router />
      </main>

      <Footer />
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

        {/* ✅ Vercel Web Analytics */}
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
