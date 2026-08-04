import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import ChallengesPage from "./pages/ChallengesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import TrainerPage from "./pages/TrainerPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import { setUser } from "./store/userSlice";
import { authAPI, subscribeAPILoading } from "./services/api";

function GlobalAPILoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeAPILoading((loadingState: boolean) => {
      setIsLoading(loadingState);
    });
    return () => unsubscribe();
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      {/* Top Pulsing Glowing Progress Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-container via-lime-400 to-emerald-400 animate-pulse shadow-glow"></div>
      
      {/* Floating Status Pill */}
      <div className="absolute top-3 right-6 bg-surface-container/90 border border-outline-variant text-on-surface text-xs font-bold px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in zoom-in duration-200">
        <div className="w-3 h-3 border-2 border-primary-container border-t-transparent rounded-full animate-spin"></div>
        <span className="font-label-caps text-[10px] text-primary-container uppercase tracking-wider">SYNCING DATA...</span>
      </div>
    </div>
  );
}

function MainLayout() {
  const location = useLocation();
  const currentUser = useSelector((state: any) => state.user);

  const isAuthenticated = Boolean(currentUser?.email || currentUser?.id || currentUser?._id);
  const isPublicPage = ["/", "/login", "/register"].includes(location.pathname);

  // If user is NOT logged in and tries to access any page other than /, /login, /register, redirect to signup (/register)
  if (!isAuthenticated && !isPublicPage) {
    return <Navigate to="/register" replace />;
  }

  if (isPublicPage) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 min-h-screen">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/trainer" element={<TrainerPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        // Wait for fonts and icons to load (with 1.5s max timeout safety)
        if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
          await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 1500)),
          ]);
        }

        // Fetch authenticated user profile
        const res = await authAPI.getMe().catch(() => null);
        if (isMounted && res?.user) {
          dispatch(setUser(res.user));
        }
      } catch (err) {
        // Handle API failures gracefully
      } finally {
        if (isMounted) {
          setAppLoading(false);
        }
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (appLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 text-on-background">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 border-4 border-surface-container-highest border-t-primary-container rounded-full animate-spin"></div>
          <span className="material-symbols-outlined absolute text-primary-container text-2xl">
            bolt
          </span>
        </div>
        <h2 className="font-display-lg text-xl text-primary font-bold tracking-widest uppercase mb-1">
          APEX PERFORMANCE
        </h2>
        <p className="font-label-caps text-xs text-on-surface-variant tracking-wider animate-pulse">
          INITIALIZING ATHLETIC ECOSYSTEM...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <GlobalAPILoader />
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;
