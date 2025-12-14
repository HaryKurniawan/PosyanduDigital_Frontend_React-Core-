import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Heart, Baby } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);

      if (response.user && response.user.role === 'ADMIN') {
        navigate('/dashboard-admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg shadow-pink-100 mb-4">
          <Baby className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">PODI</h1>
        <p className="text-gray-400 text-xs">Posyandu Digital - Kesehatan Ibu & Anak</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Selamat Datang! 👋</h2>
        <p className="text-gray-400 text-xs mb-5">Masuk ke akun Anda untuk melanjutkan</p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2.5 rounded-xl mb-4 text-xs flex items-start gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold text-sm hover:from-pink-600 hover:to-rose-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-pink-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Masuk...
              </span>
            ) : 'Masuk'}
          </button>

          {/* Forgot Password Link */}
          <p className="text-center">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs text-gray-400 hover:text-pink-500 transition"
            >
              Lupa password?
            </button>
          </p>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-xs text-gray-400">atau</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Register Link */}
        <p className="text-center text-gray-500 text-sm">
          Belum punya akun?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-semibold text-pink-500 hover:text-pink-600 transition"
          >
            Daftar Sekarang
          </button>
        </p>
      </div>

      {/* Footer */}
      <p className="text-center mt-6 text-gray-300 text-xs flex items-center justify-center gap-1">
        Made with <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> for Indonesia
      </p>
    </div>
  );
};

export default LoginPage;
