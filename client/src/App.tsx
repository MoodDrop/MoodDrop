import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import TakeABreath from "@/pages/take-a-breath";
import ThankYou from "@/pages/thank-you";
import Comfort from "@/pages/comfort";
import Garden from "@/pages/garden";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import Header from "@/components/header";
import Footer from "@/components/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/release" component={TakeABreath} />
      <Route path="/breathe" component={TakeABreath} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/comfort" component={Comfort} />
      <Route path="/garden" component={Garden} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isFullWidthPage = location === '/garden' || location === '/dashboard';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-cream-50 to-blush-100">
      <Header />
      <main className={isFullWidthPage ? '' : 'max-w-lg mx-auto px-6 py-8'}>
        <Router />
      </main>
      <Footer />
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
