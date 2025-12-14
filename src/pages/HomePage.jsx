import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileNavbar from '../components/MobileNavbar';
import { checkProfileStatus } from '../services/familyDataService';
import ProfileIncompleteModal from '../components/ProfileIncompleteModal';
import { Baby, ClipboardList, Syringe, TrendingUp } from 'lucide-react';

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

  const menuItems = [
    {
      id: 'kpsp',
      path: '/kpsp',
      icon: Baby,
      title: 'KPSP',
      subtitle: 'Kuesioner Pra Skrining'
    },
    {
      id: 'riwayat',
      path: '/riwayat-pemeriksaan',
      icon: ClipboardList,
      title: 'Riwayat',
      subtitle: 'Riwayat pemeriksaan'
    },
    {
      id: 'imunisasi',
      path: '/imunisasi',
      icon: Syringe,
      title: 'Imunisasi',
      subtitle: 'Jadwal imunisasi'
    },
    {
      id: 'tumbuh-kembang',
      path: '/tumbuh-kembang',
      icon: TrendingUp,
      title: 'Pertumbuhan',
      subtitle: 'Tumbuh kembang'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-3 text-gray-400 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MobileNavbar />
      {showModal && <ProfileIncompleteModal />}

      <div className="pt-16 pb-20 px-4">
        {/* Menu Cards */}
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-4 min-h-[120px] flex flex-col justify-end transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                {/* Background Icon - Decorative */}
                <Icon
                  className="absolute -right-3 -top-3 w-24 h-24 text-white/15"
                  strokeWidth={1}
                />

                {/* Text Content */}
                <div className="relative z-10 text-left">
                  <h3 className="text-lg font-semibold text-white tracking-tight leading-tight">{item.title}</h3>
                  <p className="text-[11px] text-white/70 mt-1 font-light">{item.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;