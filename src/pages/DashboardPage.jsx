import React, { useState, useEffect } from 'react';
import { getProfile, logout, getCurrentUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.token) {
          navigate('/login');
          return;
        }

        setUser(currentUser);
        const profile = await getProfile();
        setUser(profile);
      } catch (err) {
        setError('Failed to load profile');
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Dashboard
              </h2>
              <p className="text-gray-600">
                Welcome back, {user?.name}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition duration-200"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              {error}
            </div>
          )}

          {user && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Profile Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-lg font-medium text-gray-800">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-medium text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="text-lg font-medium text-gray-800 break-all">{user.id}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-green-600 text-white'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-lg font-medium text-gray-800">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Panel - Only for Admin */}
        {user?.role === 'ADMIN' && <AdminPanel />}
      </div>
    </div>
  );
};

export default DashboardPage;