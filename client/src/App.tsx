import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Release from "@/pages/release";
import ThankYou from "@/pages/thank-you";
import Comfort from "@/pages/comfort";
import Garden from "@/pages/garden";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { TimeBasedThemeProvider } from "@/components/TimeBasedThemeProvider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/release" component={Release} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/comfort" component={Comfort} />
      <Route path="/garden" component={Garden} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location, setLocation] = useLocation();
  const isFullWidthPage = location === '/garden' || location === '/dashboard';
  
  // Secret keyboard shortcut for admin access: Ctrl+Shift+A (Cmd+Shift+A on Mac)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setLocation('/admin');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setLocation]);
  
  return (
    <TimeBasedThemeProvider>
      <div className="min-h-screen">
        <Header />
        <main className={isFullWidthPage ? '' : 'max-w-lg mx-auto px-6 py-8'}>
          <Router />
        </main>
        <Footer />
      </div>
    </TimeBasedThemeProvider>
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
