import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Clock,
    CheckCircle,
    XCircle,
    User,
    Users,
    Baby,
    RefreshCw,
    Eye
} from 'lucide-react';
import {
    getPendingRequests,
    getAllChangeRequests,
    approveChangeRequest,
    rejectChangeRequest
} from '../../services/dataChangeService';

const KelolaPerubahanDataPage = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');

    useEffect(() => {
        fetchRequests();
    }, [activeTab]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = activeTab === 'pending'
                ? await getPendingRequests()
                : await getAllChangeRequests();
            setRequests(data);
        } catch (err) {
            console.error('Error fetching requests:', err);
            setError('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Yakin ingin menyetujui perubahan data ini?')) return;
        try {
            setActionLoading(true);
            await approveChangeRequest(id, reviewNotes);
            alert('Perubahan data disetujui');
            setSelectedRequest(null);
            setReviewNotes('');
            fetchRequests();
        } catch (err) {
            alert('Gagal menyetujui: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id) => {
        if (!reviewNotes.trim()) {
            alert('Harap isi alasan penolakan');
            return;
        }
        if (!window.confirm('Yakin ingin menolak perubahan data ini?')) return;
        try {
            setActionLoading(true);
            await rejectChangeRequest(id, reviewNotes);
            alert('Perubahan data ditolak');
            setSelectedRequest(null);
            setReviewNotes('');
            fetchRequests();
        } catch (err) {
            alert('Gagal menolak: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'MOTHER': return <User className="w-4 h-4 text-pink-500" />;
            case 'SPOUSE': return <Users className="w-4 h-4 text-blue-500" />;
            case 'CHILD': return <Baby className="w-4 h-4 text-purple-500" />;
            default: return null;
        }
    };

    const getTypeName = (type) => {
        switch (type) {
            case 'MOTHER': return 'Data Ibu';
            case 'SPOUSE': return 'Data Suami';
            case 'CHILD': return 'Data Anak';
            default: return type;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Menunggu</span>;
            case 'APPROVED':
                return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Disetujui</span>;
            case 'REJECTED':
                return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Ditolak</span>;
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFieldLabel = (field) => {
        const labels = {
            fullName: 'Nama Lengkap',
            nik: 'NIK',
            phoneNumber: 'No. Telepon',
            birthPlace: 'Tempat Lahir',
            birthDate: 'Tanggal Lahir',
            education: 'Pendidikan',
            occupation: 'Pekerjaan',
            bloodType: 'Golongan Darah',
            jkn: 'No. JKN',
            facilityTK1: 'Faskes TK1',
            birthCertificate: 'No. Akta Lahir',
            childOrder: 'Anak Ke-',
            gender: 'Jenis Kelamin'
        };
        return labels[field] || field;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard-admin')}
                            className="p-2 hover:bg-white/20 rounded-full transition"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">Kelola Perubahan Data</h1>
                            <p className="text-purple-100 text-sm">Approve atau reject permintaan perubahan data</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-xl font-medium transition ${activeTab === 'pending'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Clock className="w-4 h-4 inline mr-2" />
                        Menunggu
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 rounded-xl font-medium transition ${activeTab === 'all'
                                ? 'bg-purple-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Semua
                    </button>
                    <button
                        onClick={fetchRequests}
                        className="ml-auto p-2 bg-white text-gray-600 rounded-xl hover:bg-gray-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="mt-3 text-gray-500">Memuat data...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-md">
                        <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                            {activeTab === 'pending' ? 'Tidak ada permintaan menunggu' : 'Belum ada data'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {requests.map((request) => (
                            <div key={request.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                {getTypeIcon(request.targetType)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{request.user?.name}</p>
                                                <p className="text-xs text-gray-500">{request.user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {getStatusBadge(request.status)}
                                            <p className="text-xs text-gray-400 mt-1">{formatDate(request.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                                        <p className="text-xs text-gray-500 mb-1">Tipe Perubahan</p>
                                        <p className="font-medium text-gray-800">{getTypeName(request.targetType)}</p>
                                        <p className="text-xs text-gray-500 mt-2">Field yang diubah:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {request.changedFields?.map((field, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                                                    {getFieldLabel(field)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedRequest(request)}
                                            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Lihat Detail
                                        </button>
                                        {request.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(request.id)}
                                                    disabled={actionLoading}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedRequest(request); }}
                                                    disabled={actionLoading}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-800">Detail Perubahan</h2>
                                <button
                                    onClick={() => { setSelectedRequest(null); setReviewNotes(''); }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-3 mb-4">
                                {selectedRequest.changedFields?.map((field) => (
                                    <div key={field} className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">{getFieldLabel(field)}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-red-600 line-through">
                                                {String(selectedRequest.oldData[field] || '-')}
                                            </span>
                                            <span className="text-gray-400">→</span>
                                            <span className="text-sm text-green-600 font-medium">
                                                {String(selectedRequest.newData[field] || '-')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedRequest.status === 'PENDING' && (
                                <>
                                    <textarea
                                        value={reviewNotes}
                                        onChange={(e) => setReviewNotes(e.target.value)}
                                        placeholder="Catatan (wajib untuk penolakan)..."
                                        className="w-full p-3 border border-gray-200 rounded-xl text-sm mb-4"
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(selectedRequest.id)}
                                            disabled={actionLoading}
                                            className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition disabled:opacity-50"
                                        >
                                            {actionLoading ? 'Memproses...' : 'Setujui'}
                                        </button>
                                        <button
                                            onClick={() => handleReject(selectedRequest.id)}
                                            disabled={actionLoading}
                                            className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition disabled:opacity-50"
                                        >
                                            {actionLoading ? 'Memproses...' : 'Tolak'}
                                        </button>
                                    </div>
                                </>
                            )}

                            {selectedRequest.status !== 'PENDING' && selectedRequest.reviewNotes && (
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-500">Catatan Review</p>
                                    <p className="text-sm text-gray-700">{selectedRequest.reviewNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KelolaPerubahanDataPage;
