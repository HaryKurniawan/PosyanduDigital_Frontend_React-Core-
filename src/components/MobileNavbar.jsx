import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Home, Calendar, User, BookOpen } from 'lucide-react';

const MobileNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Navbar */}
      <div className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div>
            <h1 className="font-bold text-gray-800 text-base sm:text-lg">
              {user?.name || 'User'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">Posyandu Digital</p>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            <span className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="bg-white shadow-lg fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 lg:hidden">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          <button
            onClick={() => navigate('/home')}
            className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
              isActive('/home') 
                ? 'text-purple-600 bg-purple-50' 
                : 'text-gray-500 hover:text-purple-600 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => navigate('/edukasi')}
            className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
              isActive('/edukasi') 
                ? 'text-purple-600 bg-purple-50' 
                : 'text-gray-500 hover:text-purple-600 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs font-medium">Edukasi</span>
          </button>

          <button
            onClick={() => navigate('/jadwal')}
            className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
              isActive('/jadwal') 
                ? 'text-purple-600 bg-purple-50' 
                : 'text-gray-500 hover:text-purple-600 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs font-medium">Jadwal</span>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
              isActive('/profile') 
                ? 'text-purple-600 bg-purple-50' 
                : 'text-gray-500 hover:text-purple-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;