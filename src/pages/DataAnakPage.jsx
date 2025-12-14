import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, MapPin, CreditCard, Baby, FileText, Droplet, Edit, Clock } from 'lucide-react';
import { getFamilyData } from '../services/familyDataService';
import { submitChangeRequest, getMyChangeRequests } from '../services/dataChangeService';
import PageHeader from '../components/PageHeader';

const DataAnakPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [editData, setEditData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    fetchChildrenData();
    fetchPendingRequests();
  }, []);

  const fetchChildrenData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFamilyData();
      setChildrenData(data.childrenData || []);
    } catch (err) {
      console.error('Error fetching children data:', err);
      setError('Gagal memuat data anak');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const requests = await getMyChangeRequests();
      setPendingRequests(requests.filter(r => r.status === 'PENDING' && r.targetType === 'CHILD'));
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    }
  };

  const hasPendingRequest = (childId) => {
    return pendingRequests.some(r => r.targetId === childId);
  };

  const openEditModal = (child) => {
    setEditingChild(child);
    setEditData({ ...child });
    setShowEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitEdit = async () => {
    try {
      setSubmitting(true);
      await submitChangeRequest('CHILD', editingChild.id, editData);
      alert('Permintaan perubahan berhasil diajukan. Menunggu persetujuan admin.');
      setShowEditModal(false);
      setEditingChild(null);
      fetchPendingRequests();
    } catch (err) {
      alert('Gagal mengajukan perubahan: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '-';
    const today = new Date();
    const birth = new Date(birthDate);
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();

    if (years === 0) {
      return `${months} bulan`;
    } else if (months < 0) {
      return `${years - 1} tahun ${12 + months} bulan`;
    } else {
      return `${years} tahun ${months} bulan`;
    }
  };

  const getChildOrderText = (order) => {
    const orderText = ['Pertama', 'Kedua', 'Ketiga', 'Keempat', 'Kelima', 'Keenam', 'Ketujuh', 'Kedelapan', 'Kesembilan', 'Kesepuluh'];
    return orderText[order - 1] || `Anak ke-${order}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-3 text-gray-400 text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Data Anak" backTo="/profile" />

      <div className="px-4 py-4">
        {/* Pending Request Banner */}
        {pendingRequests.length > 0 && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <p className="text-xs text-yellow-800">
                {pendingRequests.length} permintaan perubahan menunggu persetujuan
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={fetchChildrenData}
                className="text-xs text-red-600 hover:text-red-700 underline mt-1"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {childrenData.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Baby className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">Belum Ada Data Anak</h3>
            <p className="text-sm text-gray-500">Data anak belum ditambahkan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {childrenData.map((child, index) => (
              <div key={child.id || index} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                {/* Child Header */}
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Baby className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white">{child.fullName}</h3>
                      <p className="text-xs text-white/80">{getChildOrderText(child.childOrder)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/70">Usia</p>
                      <p className="text-xs font-semibold text-white">{calculateAge(child.birthDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Child Details */}
                <div className="p-4 space-y-4">
                  {/* Edit Button */}
                  <div className="flex justify-end">
                    {hasPendingRequest(child.id) ? (
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs">
                        <Clock className="w-3 h-3" /> Menunggu Approval
                      </span>
                    ) : (
                      <button
                        onClick={() => openEditModal(child)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-xs font-medium hover:bg-pink-200 transition"
                      >
                        <Edit className="w-3 h-3" /> Edit Data
                      </button>
                    )}
                  </div>

                  {/* Identitas */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wide">Identitas</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">NIK</p>
                          <p className="text-sm text-gray-800">{child.nik}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">No. Akta Kelahiran</p>
                          <p className="text-sm text-gray-800">{child.birthCertificate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kelahiran */}
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wide">Kelahiran</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">Tempat Lahir</p>
                          <p className="text-sm text-gray-800">{child.birthPlace}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">Tanggal Lahir</p>
                          <p className="text-sm text-gray-800">{formatDate(child.birthDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kesehatan */}
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wide">Kesehatan</h4>
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-pink-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-500">Golongan Darah</p>
                        <p className="text-sm text-gray-800">{child.bloodType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingChild && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Edit Data Anak
                </h2>
                <button
                  onClick={() => { setShowEditModal(false); setEditingChild(null); }}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                <p className="text-xs text-yellow-800">
                  ⚠️ Perubahan data akan menunggu persetujuan dari kader/admin sebelum diterapkan.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={editData.fullName || ''}
                    onChange={(e) => handleEditChange('fullName', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">NIK</label>
                  <input
                    type="text"
                    value={editData.nik || ''}
                    onChange={(e) => handleEditChange('nik', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">No. Akta Kelahiran</label>
                  <input
                    type="text"
                    value={editData.birthCertificate || ''}
                    onChange={(e) => handleEditChange('birthCertificate', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Anak Ke-</label>
                  <input
                    type="number"
                    min="1"
                    value={editData.childOrder || 1}
                    onChange={(e) => handleEditChange('childOrder', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Jenis Kelamin</label>
                  <select
                    value={editData.gender || ''}
                    onChange={(e) => handleEditChange('gender', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={editData.birthPlace || ''}
                    onChange={(e) => handleEditChange('birthPlace', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formatDateInput(editData.birthDate)}
                    onChange={(e) => handleEditChange('birthDate', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Golongan Darah</label>
                  <select
                    value={editData.bloodType || ''}
                    onChange={(e) => handleEditChange('bloodType', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  >
                    <option value="">Pilih</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => { setShowEditModal(false); setEditingChild(null); }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitEdit}
                  disabled={submitting}
                  className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition disabled:opacity-50"
                >
                  {submitting ? 'Mengirim...' : 'Ajukan Perubahan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnakPage;