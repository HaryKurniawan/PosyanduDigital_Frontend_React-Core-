import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileNavbar from '../components/MobileNavbar';
import { checkProfileStatus } from '../services/familyDataService';
import ProfileIncompleteModal from '../components/ProfileIncompleteModal';
import { Calendar, ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      <MobileNavbar />
      {showModal && <ProfileIncompleteModal />}
      
      <div className="pt-20 pb-24 px-4">
        {/* Menu Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 hover:shadow-lg transition cursor-pointer">
            <div className="text-4xl mb-4">👶</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Data Anak</h3>
            <p className="text-sm text-gray-600">Kelola data pertumbuhan anak</p>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-4 hover:shadow-lg transition cursor-pointer">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Riwayat</h3>
            <p className="text-sm text-gray-600">Lihat riwayat pemeriksaan</p>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4 hover:shadow-lg transition cursor-pointer">
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

        {/* Jadwal Mendatang */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">Jadwal Mendatang</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Posyandu Balita</p>
                  <p className="text-xs text-gray-600">Besok, 08.00 WIB</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;