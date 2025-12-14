import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Mail, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { verifyEmail, resendVerification } from '../services/authService';

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [resendEmail, setResendEmail] = useState('');
    const [resending, setResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    useEffect(() => {
        if (token) {
            verifyToken();
        } else {
            setLoading(false);
        }
    }, [token]);

    const verifyToken = async () => {
        try {
            setLoading(true);
            await verifyEmail(token);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Token tidak valid atau sudah kadaluarsa');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async (e) => {
        e.preventDefault();
        if (!resendEmail) return;

        try {
            setResending(true);
            await resendVerification(resendEmail);
            setResendSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengirim ulang');
        } finally {
            setResending(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memverifikasi email...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Email Terverifikasi! ✨</h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Akun Anda telah berhasil diverifikasi. Anda sekarang dapat menggunakan semua fitur aplikasi.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-rose-600 transition"
                    >
                        Login Sekarang
                    </Link>
                </div>
            </div>
        );
    }

    // No token or error state - show resend form
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
                <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${error ? 'bg-red-100' : 'bg-pink-100'
                        }`}>
                        {error ? (
                            <XCircle className="w-8 h-8 text-red-600" />
                        ) : (
                            <Mail className="w-8 h-8 text-pink-600" />
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {error ? 'Verifikasi Gagal' : 'Verifikasi Email'}
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        {error || 'Masukkan email untuk mengirim ulang link verifikasi'}
                    </p>
                </div>

                {resendSuccess ? (
                    <div className="text-center">
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                            Email verifikasi telah dikirim! Cek inbox atau folder spam.
                        </div>
                        <Link
                            to="/login"
                            className="text-pink-600 font-medium hover:underline"
                        >
                            Kembali ke Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleResend} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={resendEmail}
                                onChange={(e) => setResendEmail(e.target.value)}
                                placeholder="email@example.com"
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={resending}
                            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-rose-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                            {resending ? 'Mengirim...' : 'Kirim Ulang Verifikasi'}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            <Link to="/login" className="text-pink-600 font-medium">Kembali ke Login</Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
