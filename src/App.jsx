import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import FamilyDataFormPage from './pages/FamilyDataFormPage';
import { getCurrentUser } from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  return user && user.token ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to home if logged in)
const PublicRoute = ({ children }) => {
  const user = getCurrentUser();
  return user && user.token ? <Navigate to="/home" /> : children; // ← CHANGED: /dashboard ke /home
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

        {/* Protected Routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
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

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;