import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { IntroAnimation } from "@/components/IntroAnimation";
import { BottomNav } from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
import { AIChatbot } from "@/components/AIChatbot";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Health from "./pages/Health";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import OrderHistory from "./pages/OrderHistory";
import MealPlanner from "./pages/MealPlanner";
import WorkoutHistory from "./pages/WorkoutHistory";
import Checkout from "./pages/Checkout";
import Onboarding from "./pages/Onboarding";
import Workout from "./pages/Workout";
import NotFound from "./pages/NotFound";
import { useSettings } from "@/hooks/useSettings";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { onboardingComplete, lastAuthId, setOnboardingComplete, setLastAuthId, recordActivity } = useSettings();

  // Per-account onboarding: reset if different user logs in
  useEffect(() => {
    if (user && user.id && lastAuthId && user.id !== lastAuthId) {
      setOnboardingComplete(false);
      setLastAuthId(user.id);
    } else if (user && user.id && !lastAuthId) {
      setLastAuthId(user.id);
    }
  }, [user?.id]);

  // Record daily login streak
  useEffect(() => {
    if (user && isAuthenticated) {
      recordActivity();
    }
  }, [user?.id, isAuthenticated]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-display tracking-wider">LOADING...</div>;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isOnboardingPage = location.pathname === '/onboarding';
  const hideNav = isAuthPage || isOnboardingPage;
  const { initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    const introShown = sessionStorage.getItem('strivo-intro-shown');
    if (introShown) {
      setShowIntro(false);
      setIntroComplete(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    sessionStorage.setItem('strivo-intro-shown', 'true');
    setTimeout(() => setShowIntro(false), 800);
  };

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      
      <div className={`transition-opacity duration-700 ${introComplete ? 'opacity-100' : 'opacity-0'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><ProtectedRoute><Home /></ProtectedRoute></PageTransition>} />
            <Route path="/shop" element={<PageTransition><ProtectedRoute><Shop /></ProtectedRoute></PageTransition>} />
            <Route path="/workout" element={<PageTransition><ProtectedRoute><Workout /></ProtectedRoute></PageTransition>} />
            <Route path="/health" element={<PageTransition><ProtectedRoute><Health /></ProtectedRoute></PageTransition>} />
            <Route path="/profile" element={<PageTransition><ProtectedRoute><Profile /></ProtectedRoute></PageTransition>} />
            <Route path="/orders" element={<PageTransition><ProtectedRoute><OrderHistory /></ProtectedRoute></PageTransition>} />
            <Route path="/meals" element={<PageTransition><ProtectedRoute><MealPlanner /></ProtectedRoute></PageTransition>} />
            <Route path="/workout-history" element={<PageTransition><ProtectedRoute><WorkoutHistory /></ProtectedRoute></PageTransition>} />
            <Route path="/checkout" element={<PageTransition><ProtectedRoute><Checkout /></ProtectedRoute></PageTransition>} />
            <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
            <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
        
        {!hideNav && <BottomNav />}
        {location.pathname === '/' && <AIChatbot />}
      </div>
    </>
  );
};

const ThemeInitializer = ({ children }: { children: React.ReactNode }) => {
  const { mode, setMode } = useTheme();

  useEffect(() => {
    setMode(mode);
  }, []);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeInitializer>
          <AppContent />
        </ThemeInitializer>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
