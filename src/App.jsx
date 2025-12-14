import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import RiwayatPemeriksaanPage from './pages/RiwayatPemeriksaanPage';
import TumbuhKembangPage from './pages/TumbuhKembangPage';
import DashboardAdminPage from './pages/admin/DashboardAdminPage';
import DetailDataAnakPage from './pages/admin/DetailDataAnakPage';
import ScheduleManagementPage from './pages/admin/ScheduleManagementPage';
import InputPemeriksaanPage from './pages/admin/InputPemeriksaanPage';
import { getCurrentUser } from './services/authService';
import DetailJadwalAdmin from './pages/admin/DetailJadwalAdmin';
import DaftarAnakAdminPage from './pages/admin/DaftarAnakAdminPage';
import KPSPPage from './pages/KPSPPage';
import ImunisasiPage from './pages/ImunisasiPage';
import KelolaImunisasiAdminPage from './pages/admin/KelolaImunisasiAdminPage';
import KelolaKPSPPage from './pages/admin/KelolaKPSPPage';
import ScreeningDetailPage from './pages/admin/ScreeningDetailPage';
import KelolaPerubahanDataPage from './pages/admin/KelolaPerubahanDataPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  return user && user.token ? children : <Navigate to="/login" />;
};

// Admin Route Component
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

const PublicRoute = ({ children }) => {
  const user = getCurrentUser();

  if (user && user.token) {
    if (user.role === 'ADMIN') {
      return <Navigate to="/dashboard-admin" />;
    }
    return <Navigate to="/home" />;
  }

  return children;
};

// Layout wrapper component that applies mobile container only for user routes
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dashboard-admin') ||
    location.pathname.startsWith('/detail-data-anak');

  // Admin routes - full width desktop layout
  if (isAdminRoute) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  // User routes - mobile container (max-w-xl centered)
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-xl mx-auto bg-white min-h-screen relative">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Admin Routes - Desktop Layout */}
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
          <Route
            path="/admin/jadwal/:scheduleId"
            element={
              <AdminRoute>
                <DetailJadwalAdmin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/daftar-anak"
            element={
              <AdminRoute>
                <DaftarAnakAdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/kelola-kpsp"
            element={
              <AdminRoute>
                <KelolaKPSPPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/kpsp/screening/:screeningId"
            element={
              <AdminRoute>
                <ScreeningDetailPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/kelola-perubahan-data"
            element={
              <AdminRoute>
                <KelolaPerubahanDataPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/kelola-jadwal"
            element={
              <AdminRoute>
                <ScheduleManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/kelola-imunisasi"
            element={
              <AdminRoute>
                <KelolaImunisasiAdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/input-pemeriksaan/:scheduleId"
            element={
              <AdminRoute>
                <InputPemeriksaanPage />
              </AdminRoute>
            }
          />

          {/* User Protected Routes - Mobile Layout */}
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
            path="/kpsp"
            element={
              <ProtectedRoute>
                <KPSPPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/imunisasi"
            element={
              <ProtectedRoute>
                <ImunisasiPage />
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
          <Route
            path="/riwayat-pemeriksaan"
            element={
              <ProtectedRoute>
                <RiwayatPemeriksaanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tumbuh-kembang"
            element={
              <ProtectedRoute>
                <TumbuhKembangPage />
              </ProtectedRoute>
            }
          />

          {/* Default & 404 Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;