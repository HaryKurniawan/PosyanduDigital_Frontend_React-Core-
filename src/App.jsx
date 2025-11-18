import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import EdukasiPage from './pages/EdukasiPage';
import JadwalPage from './pages/JadwalPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import FamilyDataFormPage from './pages/FamilyDataFormPage';
import DataKeluargaPage from './pages/DataKeluargaPage';
import DataAnakPage from './pages/DataAnakPage';
import DashboardAdminPage from './pages/admin/DashboardAdminPage'; // NEW
import DetailDataAnakPage from './pages/admin/DetailDataAnakPage'; // NEW
import { getCurrentUser } from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  return user && user.token ? children : <Navigate to="/login" />;
};

// Admin Route Component - NEW
const AdminRoute = ({ children }) => {
  const user = getCurrentUser();
  
  if (!user || !user.token) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'ADMIN') {
    return <Navigate to="/home" />;
  }
  
  return children;
};

// Public Route Component (redirect to home if logged in)
const PublicRoute = ({ children }) => {
  const user = getCurrentUser();
  
  if (user && user.token) {
    // Redirect based on role
    if (user.role === 'admin') {
      return <Navigate to="/dashboard-admin" />;
    }
    return <Navigate to="/home" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />

        {/* Admin Routes - NEW */}
        <Route 
          path="/dashboard-admin" 
          element={
            <AdminRoute>
              <DashboardAdminPage />
            </AdminRoute>
          } 
        />
        <Route 
          path="/detail-data-anak/:childId" 
          element={
            <AdminRoute>
              <DetailDataAnakPage />
            </AdminRoute>
          } 
        />

        {/* User Protected Routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edukasi" 
          element={
            <ProtectedRoute>
              <EdukasiPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/jadwal" 
          element={
            <ProtectedRoute>
              <JadwalPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/family-data-form" 
          element={
            <ProtectedRoute>
              <FamilyDataFormPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/data-keluarga" 
          element={
            <ProtectedRoute>
              <DataKeluargaPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/data-anak" 
          element={
            <ProtectedRoute>
              <DataAnakPage />
            </ProtectedRoute>
          } 
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;