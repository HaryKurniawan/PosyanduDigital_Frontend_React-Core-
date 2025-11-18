import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileNavbar from '../components/MobileNavbar';
import { User, Users, Baby, Heart, ChevronRight, Edit, LogOut, Settings, AlertCircle } from 'lucide-react';
import { getFamilyData } from '../services/familyDataService';

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
      
      // Get user from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);

      // Fetch family data from API
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
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      <MobileNavbar />
      
      <div className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button 
                  onClick={fetchProfileData}
                  className="text-xs text-red-600 hover:text-red-700 underline mt-1"
                >
                  Coba lagi
                </button>
              </div>
            </div>
          )}

          {/* Profile Header */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {user?.name || 'Nama Pengguna'}
                </h2>
                <p className="text-sm sm:text-base text-gray-500">{user?.email || 'email@example.com'}</p>
              </div>
              <button 
                onClick={() => navigate('/edit-profile')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Data Keluarga Section */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg sm:text-xl">Data Keluarga</h3>
            
            <div className="space-y-3">
              
             
              {/* Data Anak */}
              <button
                onClick={() => navigate('/data-anak')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <Baby className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">Data Anak</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {familyData?.children?.length > 0 
                        ? `${familyData.children.length} anak terdaftar` 
                        : 'Belum ada anak terdaftar'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* Data Keluarga Lengkap */}
              <button
                onClick={() => navigate('/data-keluarga')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl hover:shadow-md hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">Data Keluarga</p>
                    <p className="text-xs sm:text-sm text-gray-600">Ringkasan lengkap keluarga</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Pengaturan Section */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg sm:text-xl">Pengaturan</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/settings')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md hover:bg-gray-100 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Settings className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">Pengaturan Akun</p>
                    <p className="text-xs sm:text-sm text-gray-600">Ubah password & preferensi</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:shadow-md hover:bg-red-100 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                    <LogOut className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-red-600 text-sm sm:text-base">Keluar</p>
                    <p className="text-xs sm:text-sm text-red-500">Logout dari aplikasi</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;