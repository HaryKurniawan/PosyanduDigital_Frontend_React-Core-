import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Home, Calendar, User, BookOpen } from 'lucide-react';

const MobileNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const isActive = (path) => location.pathname === path;

  const getPageTitle = () => {
    const titles = {
      '/home': null,
      '/edukasi': 'Edukasi',
      '/jadwal': 'Jadwal',
      '/profile': 'Profil'
    };
    return titles[location.pathname] || null;
  };

  const pageTitle = getPageTitle();
  const showUserGreeting = location.pathname === '/home';

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/edukasi', icon: BookOpen, label: 'Edukasi' },
    { path: '/jadwal', icon: Calendar, label: 'Jadwal' },
    { path: '/profile', icon: User, label: 'Profil' }
  ];

  return (
    <>
      {/* Top Navbar */}
      <div className="bg-white fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="font-semibold text-gray-800 text-base">
            {showUserGreeting ? `Hi, ${user?.name || 'User'} 👋` : (pageTitle || 'PODI')}
          </h1>
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* Bottom Navbar - Clean & Simple */}
      <div className="bg-white border-t border-gray-100 fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`
                  flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all duration-200
                  ${active ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-105' : ''}`} />
                <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>
                  {label}
                </span>
                {active && (
                  <div className="w-1 h-1 bg-pink-500 rounded-full -mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;