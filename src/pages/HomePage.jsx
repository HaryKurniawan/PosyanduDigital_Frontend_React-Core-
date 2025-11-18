import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { checkProfileStatus } from '../services/familyDataService';
import ProfileIncompleteModal from '../components/ProfileIncompleteModal';

const HomePage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const status = await checkProfileStatus();
        setShowModal(!status.hasCompletedProfile);
      } catch (error) {
        console.error('Error checking profile status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
      {showModal && <ProfileIncompleteModal />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                🏥 Posyandu Digital
              </h1>
              <p className="text-gray-600 mt-2">Selamat datang, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-4xl mb-4">👶</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Data Anak</h3>
              <p className="text-gray-600">Kelola data pertumbuhan anak</p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Riwayat Kesehatan</h3>
              <p className="text-gray-600">Lihat riwayat pemeriksaan</p>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Jadwal Posyandu</h3>
              <p className="text-gray-600">Cek jadwal pemeriksaan</p>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-6 hover:shadow-lg transition cursor-pointer">
              <div className="text-4xl mb-4">💉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Imunisasi</h3>
              <p className="text-gray-600">Pantau jadwal imunisasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;