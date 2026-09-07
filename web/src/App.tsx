import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
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
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) return prev;
        return prev + Math.random() * 25;
      });
    }, 200);

    // Check authentication status
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          setIsAuthenticated(true);
        }
        setProgress(95);

        // Final delay for smooth transition
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
    return <SplashScreen message="Initialisation de l'application..." progress={progress} />;
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/conductors" element={<Conductors />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/council" element={<Council />} />
          <Route path="/prayer-subjects" element={<PrayerSubjects />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
