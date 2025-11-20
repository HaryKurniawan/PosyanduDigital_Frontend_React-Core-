import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllChildren } from '../../services/adminService';
import { logout } from '../../services/authService';
import { Calendar, Users, FileText, TrendingUp, LogOut, Baby, Syringe } from 'lucide-react';

const DashboardAdminPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalSchedules: 0,
    totalExaminations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const childrenData = await getAllChildren();
      setStats({
        totalChildren: childrenData.length,
        totalSchedules: 0, // TODO: Add API call
        totalExaminations: 0 // TODO: Add API call
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Kelola Jadwal',
      description: 'Buat & kelola jadwal posyandu',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
      path: '/admin/kelola-jadwal'
    },
    {
      title: 'Daftar Anak',
      description: 'Lihat data semua anak',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      path: '/admin/daftar-anak'
    },
    {
      title: 'Kelola Imunisasi',
      description: 'Master data vaksin & imunisasi',
      icon: Syringe,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
      iconColor: 'text-pink-600',
      path: '/admin/kelola-imunisasi'
    },
    {
      title: 'Laporan',
      description: 'Lihat laporan & statistik',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      iconColor: 'text-green-600',
      path: '/admin/laporan'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Admin</h1>
              <p className="text-purple-100 mt-1">Sistem Informasi Posyandu</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-purple-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-50 transition shadow-md"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Anak */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Anak</p>
                <p className="text-4xl font-bold text-gray-800">
                  {stats.totalChildren}
                </p>
                <p className="text-xs text-gray-400 mt-1">Anak terdaftar</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-2xl">
                <Baby className="w-10 h-10 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Total Jadwal */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Jadwal</p>
                <p className="text-4xl font-bold text-gray-800">
                  {stats.totalSchedules}
                </p>
                <p className="text-xs text-gray-400 mt-1">Jadwal aktif</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-2xl">
                <Calendar className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Pemeriksaan */}
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Pemeriksaan</p>
                <p className="text-4xl font-bold text-gray-800">
                  {stats.totalExaminations}
                </p>
                <p className="text-xs text-gray-400 mt-1">Data pemeriksaan</p>
              </div>
              <div className="bg-green-100 p-4 rounded-2xl">
                <FileText className="w-10 h-10 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Menu Utama</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden group"
              >
                <div className={`bg-gradient-to-br ${item.bgColor} p-6 transition-all group-hover:scale-105`}>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-md">
                    <Icon className={`w-8 h-8 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
                
                <div className={`bg-gradient-to-r ${item.color} p-4`}>
                  <div className="flex items-center justify-between text-white">
                    <span className="font-semibold text-sm">Buka Menu</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Informasi Sistem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Kelola Jadwal</p>
                <p className="text-xs text-gray-600 mt-1">
                  Buat jadwal posyandu baru dan kelola pendaftaran
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">👶</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Data Anak</p>
                <p className="text-xs text-gray-600 mt-1">
                  Lihat dan kelola data lengkap semua anak
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-xl">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💉</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Kelola Imunisasi</p>
                <p className="text-xs text-gray-600 mt-1">
                  Kelola master data vaksin dan jadwal imunisasi
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Laporan</p>
                <p className="text-xs text-gray-600 mt-1">
                  Lihat statistik dan laporan pemeriksaan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminPage;