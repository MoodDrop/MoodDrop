// client/src/App.tsx
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { readFlags } from "@/lib/featureFlags";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import TakeABreath from "@/pages/take-a-breath";
import ThankYou from "@/pages/thank-you";
import CalmStudio from "@/pages/CalmStudio";
import Garden from "@/pages/garden";
import MyDropsPage from "@/pages/MyDropsPage";
import DropItPage from "@/pages/DropItPage";
import CommunityPage from "@/pages/CommunityPage";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import AdminPage from "@/pages/AdminPage";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import QAPage from "@/pages/QAPage";
import ContactPage from "@/pages/ContactPage";

// ✅ Soft Reads (Blog)
import SoftReadsPage from "@/pages/SoftReadsPage";
import SoftReadPostPage from "@/pages/SoftReadPostPage";

import Header from "@/components/header";
import Footer from "@/components/footer";

console.log("[MoodDrop] App.tsx mounted");

function Router() {
  const flags = readFlags();
  console.log("[MoodDrop] Router initialized — feature flags:", flags);

  return (
    <Switch>
      {/* Core pages */}
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/release" component={TakeABreath} />
      <Route path="/breathe" component={TakeABreath} />

      {/* Calm Studio + Garden */}
      <Route path="/comfort" component={CalmStudio} />
      <Route path="/calm-studio" component={CalmStudio} />
      <Route path="/garden" component={Garden} />

      {/* Drops */}
      <Route path="/my-drops" component={MyDropsPage} />
      <Route path="/drop-it" component={DropItPage} />

      {/* Community (feature-flagged) */}
      {flags.communityEnabled && (
        <Route
          path="/community"
          component={CommunityPage}
          onEnter={() =>
            console.log("[MoodDrop] ✅ Rendering CommunityPage route")
          }
        />
      )}

      {/* Static pages */}
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/qa" component={QAPage} />
      <Route path="/contact" component={ContactPage} />

      {/* ✅ Soft Reads */}
      <Route path="/soft-reads" component={SoftReadsPage} />
      <Route path="/soft-reads/:slug" component={SoftReadPostPage} />

      {/* Admin */}
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin-legacy" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />

      {/* 404 fallback */}
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
    location === "/comfort";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-cream-50 to-blush-100">
      <Header />
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
