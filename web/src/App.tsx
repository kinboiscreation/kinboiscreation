import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/theme-context';
import Layout from './components/Layout';
import ErrorBoundary from './components/error-boundary';
import SplashScreen from './components/splash-screen';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Calendar from './pages/Calendar';
import Announcements from './pages/Announcements';
import Conductors from './pages/Conductors';
import Meetings from './pages/Meetings';
import Documents from './pages/Documents';
import Council from './pages/Council';
import Settings from './pages/Settings';
import PrayerSubjects from './pages/PrayerSubjects';
import UserManagement from './pages/UserManagement';
import AtmospherePrayer from './pages/AtmospherePrayer';
import Vigils from './pages/Vigils';
import NightPrayer from './pages/NightPrayer';
import TonguesOfFire from './pages/TonguesOfFire';
import WomenPrograms from './pages/WomenPrograms';
import Intercession from './pages/Intercession';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 85 ? prev : prev + Math.random() * 25));
    }, 200);

    const checkAuth = async () => {
      try {
        if (localStorage.getItem('authToken')) setIsAuthenticated(true);
        setProgress(95);
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(100);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    return () => clearInterval(progressInterval);
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider>
        <SplashScreen message="Initialisation de l'application..." progress={progress} />
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <Login onLogin={() => setIsAuthenticated(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <ErrorBoundary>
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/atmosphere" element={<AtmospherePrayer />} />
            <Route path="/vigils" element={<Vigils />} />
            <Route path="/night-prayer" element={<NightPrayer />} />
            <Route path="/tongues-of-fire" element={<TonguesOfFire />} />
            <Route path="/women-programs" element={<WomenPrograms />} />
            <Route path="/intercession" element={<Intercession />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/conductors" element={<Conductors />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/prayer-subjects" element={<PrayerSubjects />} />
            <Route path="/council" element={<Council />} />
            <Route path="/users" element={<UserManagement />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
