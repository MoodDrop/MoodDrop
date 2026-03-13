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
import CalmStudioPage from "@/pages/CalmStudioPage";

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
      <Route path="/comfort" component={CalmStudioPage} />
      <Route path="/calm-studio" component={CalmStudioPage} />

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