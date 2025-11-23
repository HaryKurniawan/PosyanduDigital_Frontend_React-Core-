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
import RiwayatPemeriksaanPage from './pages/RiwayatPemeriksaanPage'; // 🆕 NEW
import DashboardAdminPage from './pages/admin/DashboardAdminPage';
import DetailDataAnakPage from './pages/admin/DetailDataAnakPage';
import ScheduleManagementPage from './pages/admin/ScheduleManagementPage'; // 🆕 NEW
import InputPemeriksaanPage from './pages/admin/InputPemeriksaanPage'; // 🆕 NEW
import { getCurrentUser } from './services/authService';
import DetailJadwalAdmin from './pages/admin/DetailJadwalAdmin';
import DaftarAnakAdminPage from './pages/admin/DaftarAnakAdminPage'; // 🆕 NEW
import KPSPPage from './pages/KPSPPage';
import ImunisasiPage from './pages/ImunisasiPage';
import KelolaImunisasiAdminPage from './pages/admin/KelolaImunisasiAdminPage';


// Di file routes Anda
import KelolaKPSPPage from './pages/admin/KelolaKPSPPage';
import ScreeningDetailPage from './pages/admin/ScreeningDetailPage';

// Tambahkan routes:


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

// Public Route Component (redirect to home if logged in)
const PublicRoute = ({ children }) => {
  const user = getCurrentUser();
  
  if (user && user.token) {
    // Redirect based on role
    if (user.role === 'ADMIN') { // 🔧 FIXED: Harus uppercase ADMIN
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

        {/* ============================================ */}
        {/* Admin Routes */}
        {/* ============================================ */}
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
            <DetailJadwalAdmin />
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
        
        {/* 🆕 NEW: Kelola Jadwal Posyandu */}
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
        {/* 🆕 NEW: Input Pemeriksaan Anak */}
        <Route 
          path="/admin/input-pemeriksaan/:scheduleId" 
          element={
            <AdminRoute>
              <InputPemeriksaanPage />
            </AdminRoute>
          } 
        />

        {/* ============================================ */}
        {/* User Protected Routes */}
        {/* ============================================ */}
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
        {/* 🆕 NEW: Riwayat Pemeriksaan */}
        <Route 
          path="/riwayat-pemeriksaan" 
          element={
            <ProtectedRoute>
              <RiwayatPemeriksaanPage />
            </ProtectedRoute>
          } 
        />

        {/* ============================================ */}
        {/* Default & 404 Routes */}
        {/* ============================================ */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;