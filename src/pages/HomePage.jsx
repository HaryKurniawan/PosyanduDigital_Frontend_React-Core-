import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileNavbar from '../components/MobileNavbar';
import { checkProfileStatus } from '../services/familyDataService';
import ProfileIncompleteModal from '../components/ProfileIncompleteModal';

const HomePage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MobileNavbar />
      {showModal && <ProfileIncompleteModal />}
      
      <div className="pt-20 pb-24 px-4">
        {/* Menu Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div 
            onClick={() => navigate('/kpsp')}
            className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 hover:shadow-lg transition cursor-pointer"
          >
            <div className="text-4xl mb-4">👶</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">KPSP</h3>
            <p className="text-sm text-gray-600">Kuesioner Pra Skrining Perkembangan</p>
          </div>

          <div 
            onClick={() => navigate('/riwayat-pemeriksaan')}
            className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-4 hover:shadow-lg transition cursor-pointer"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Riwayat</h3>
            <p className="text-sm text-gray-600">Lihat riwayat pemeriksaan</p>
          </div>

          <div 
            onClick={() => navigate('/imunisasi')}
            className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4 hover:shadow-lg transition cursor-pointer"
          >
            <div className="text-4xl mb-4">💉</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Imunisasi</h3>
            <p className="text-sm text-gray-600">Pantau jadwal imunisasi</p>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-4 hover:shadow-lg transition cursor-pointer">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Pertumbuhan</h3>
            <p className="text-sm text-gray-600">Pantau tumbuh kembang</p>
          </div>
        </div>
     
      </div>
    </div>
  );
};

export default HomePage;