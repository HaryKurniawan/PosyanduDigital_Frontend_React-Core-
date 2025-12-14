import React, { useState, useEffect } from 'react';
import MobileNavbar from '../components/MobileNavbar';
import { User, Users, Baby, ChevronRight, Edit, LogOut, Settings, AlertCircle } from 'lucide-react';
import { getFamilyData } from '../services/familyDataService';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);

      const data = await getFamilyData();
      setFamilyData(data);

    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-3 text-gray-400 text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MobileNavbar />

      <div className="pt-16 pb-20 px-4">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-red-700">{error}</p>
              <button
                onClick={fetchProfileData}
                className="text-xs text-red-500 hover:text-red-600 underline mt-1"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-gray-800 truncate">
                {user?.name || 'Nama Pengguna'}
              </h2>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'email@example.com'}</p>
            </div>
            <button
              onClick={() => navigate('/edit-profile')}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Data Keluarga Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-2 px-1">Data Keluarga</h3>

          <div className="space-y-2">
            {/* Data Anak */}
            <button
              onClick={() => navigate('/data-anak')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Baby className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800 text-sm">Data Anak</p>
                  <p className="text-[10px] text-gray-500">
                    {familyData?.children?.length > 0
                      ? `${familyData.children.length} anak terdaftar`
                      : 'Belum ada data'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Data Keluarga Lengkap */}
            <button
              onClick={() => navigate('/data-keluarga')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800 text-sm">Data Keluarga</p>
                  <p className="text-[10px] text-gray-500">Ringkasan lengkap</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Pengaturan Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2 px-1">Pengaturan</h3>

          <div className="space-y-2">
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800 text-sm">Pengaturan Akun</p>
                  <p className="text-[10px] text-gray-500">Ubah password & preferensi</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all border border-red-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-red-600 text-sm">Keluar</p>
                  <p className="text-[10px] text-red-400">Logout dari aplikasi</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;