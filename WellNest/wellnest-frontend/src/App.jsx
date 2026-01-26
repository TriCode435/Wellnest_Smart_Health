import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Footer from './components/layout/Footer';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import UserDashboard from './pages/user/UserDashboard';
import ActivityPage from './pages/user/ActivityPage';
import NutritionPage from './pages/user/NutritionPage';
import BMIPage from './pages/user/BMIPage';
import ProfilePage from './pages/user/ProfilePage';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import UserDetailDashboard from './pages/trainer/UserDetailDashboard';

import AdminDashboard from './pages/admin/AdminDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontWeight: 900, color: 'var(--primary)' }}>INITIALIZING PROTOCOL...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="main-container pt-6">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <ActivityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <NutritionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bmi"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <BMIPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['USER', 'TRAINER']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Trainer Routes */}
          <Route
            path="/trainer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['TRAINER']}>
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trainer/user-details/:id"
            element={
              <ProtectedRoute allowedRoles={['TRAINER']}>
                <UserDetailDashboard />
              </ProtectedRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {user && <Footer />}
    </div>
  );
}

export default App;
