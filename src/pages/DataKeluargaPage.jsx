import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, MapPin, Briefcase, Phone, CreditCard, Heart, User, Edit, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getFamilyData } from '../services/familyDataService';
import { submitChangeRequest, getMyChangeRequests } from '../services/dataChangeService';
import PageHeader from '../components/PageHeader';
import SlidingTabs from '../components/SlidingTabs';

const DataKeluargaPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ibu');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [familyData, setFamilyData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState(null); // 'MOTHER' or 'SPOUSE'
  const [editData, setEditData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    fetchFamilyData();
    fetchPendingRequests();
  }, []);

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFamilyData();
      setFamilyData(data);
    } catch (err) {
      console.error('Error fetching family data:', err);
      setError('Gagal memuat data keluarga');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const requests = await getMyChangeRequests();
      setPendingRequests(requests.filter(r => r.status === 'PENDING'));
    } catch (err) {
      console.error('Error fetching pending requests:', err);
    }
  };

  const hasPendingRequest = (type) => {
    return pendingRequests.some(r => r.targetType === type && r.status === 'PENDING');
  };

  const openEditModal = (type, data) => {
    setEditType(type);
    setEditData({ ...data });
    setShowEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitEdit = async () => {
    try {
      setSubmitting(true);
      const targetId = editType === 'MOTHER' ? familyData.motherData.id : familyData.spouseData.id;
      await submitChangeRequest(editType, targetId, editData);
      alert('Permintaan perubahan berhasil diajukan. Menunggu persetujuan admin.');
      setShowEditModal(false);
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

  const motherData = familyData?.motherData;
  const spouseData = familyData?.spouseData;

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Data Keluarga" backTo="/profile" />

      <div className="py-4">
        {/* Pending Request Banner */}
        {pendingRequests.length > 0 && (
          <div className="px-4 pb-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <p className="text-xs text-yellow-800">
                  {pendingRequests.length} permintaan perubahan menunggu persetujuan
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-4 pb-4">
          <SlidingTabs
            tabs={[
              { id: 'ibu', label: 'Data Ibu', icon: <Heart className="w-3.5 h-3.5" /> },
              { id: 'suami', label: 'Data Suami', icon: <User className="w-3.5 h-3.5" /> }
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="px-4 pb-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800">{error}</p>
                <button
                  onClick={fetchFamilyData}
                  className="text-xs text-red-600 hover:text-red-700 underline mt-1"
                >
                  Coba lagi
                </button>
              </div>
            </div>
          )}

          {/* Tab Content - Data Ibu */}
          {activeTab === 'ibu' && (
            <>
              {!motherData ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-pink-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">Belum Ada Data</h3>
                  <p className="text-sm text-gray-500">Data ibu belum dilengkapi</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Edit Button */}
                  <div className="flex justify-end">
                    {hasPendingRequest('MOTHER') ? (
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs">
                        <Clock className="w-3 h-3" /> Menunggu Approval
                      </span>
                    ) : (
                      <button
                        onClick={() => openEditModal('MOTHER', motherData)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-xs font-medium hover:bg-pink-200 transition"
                      >
                        <Edit className="w-3 h-3" /> Edit Data
                      </button>
                    )}
                  </div>

                  {/* Personal Info Card */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 text-xs uppercase tracking-wide">Informasi Pribadi</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-500">Nama Lengkap</p>
                        <p className="text-sm font-medium text-gray-800">{motherData.fullName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">Nomor Telepon</p>
                          <p className="text-sm font-medium text-gray-800">{motherData.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">NIK</p>
                          <p className="text-sm font-medium text-gray-800">{motherData.nik}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Birth Info Card */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 text-xs uppercase tracking-wide">Informasi Kelahiran</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">Tempat Lahir</p>
                          <p className="text-sm font-medium text-gray-800">{motherData.birthPlace}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">Tanggal Lahir</p>
                          <p className="text-sm font-medium text-gray-800">{formatDate(motherData.birthDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Info Card */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 text-xs uppercase tracking-wide">Pendidikan & Pekerjaan</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-500">Pendidikan</p>
                        <p className="text-sm font-medium text-gray-800">{motherData.education}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">Pekerjaan</p>
                          <p className="text-sm font-medium text-gray-800">{motherData.occupation}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Health Info Card */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 text-xs uppercase tracking-wide">Informasi Kesehatan</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-500">Golongan Darah</p>
                        <p className="text-sm font-medium text-gray-800">{motherData.bloodType}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">Nomor JKN/KIS</p>
                        <p className="text-sm font-medium text-gray-800">{motherData.jkn}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">Faskes Tingkat 1</p>
                        <p className="text-sm font-medium text-gray-800">{motherData.facilityTK1}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Tab Content - Data Suami */}
          {activeTab === 'suami' && (
            <>
              {!spouseData ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-pink-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">Belum Ada Data</h3>
                  <p className="text-sm text-gray-500">Data suami/ayah belum dilengkapi</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Edit Button */}
                  <div className="flex justify-end">
                    {hasPendingRequest('SPOUSE') ? (
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs">
                        <Clock className="w-3 h-3" /> Menunggu Approval
                      </span>
                    ) : (
                      <button
                        onClick={() => openEditModal('SPOUSE', spouseData)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-xs font-medium hover:bg-pink-200 transition"
                      >
                        <Edit className="w-3 h-3" /> Edit Data
                      </button>
                    )}
                  </div>

                  {/* Personal Info Card */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 text-xs uppercase tracking-wide">Informasi Pribadi</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-500">Nama Lengkap</p>
                        <p className="text-sm font-medium text-gray-800">{spouseData.fullName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">NIK</p>
                          <p className="text-sm font-medium text-gray-800">{spouseData.nik}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">Nomor Telepon</p>
                          <p className="text-sm font-medium text-gray-800">{spouseData.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Info Card */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 text-xs uppercase tracking-wide">Informasi Pekerjaan</h3>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-pink-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-500">Pekerjaan</p>
                        <p className="text-sm font-medium text-gray-800">{spouseData.occupation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Edit {editType === 'MOTHER' ? 'Data Ibu' : 'Data Suami'}
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
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
                {/* Common fields */}
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
                  <label className="block text-xs text-gray-600 mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    value={editData.phoneNumber || ''}
                    onChange={(e) => handleEditChange('phoneNumber', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={editData.occupation || ''}
                    onChange={(e) => handleEditChange('occupation', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                  />
                </div>

                {/* Mother-specific fields */}
                {editType === 'MOTHER' && (
                  <>
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
                      <label className="block text-xs text-gray-600 mb-1">Pendidikan</label>
                      <input
                        type="text"
                        value={editData.education || ''}
                        onChange={(e) => handleEditChange('education', e.target.value)}
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
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Nomor JKN/KIS</label>
                      <input
                        type="text"
                        value={editData.jkn || ''}
                        onChange={(e) => handleEditChange('jkn', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Faskes Tingkat 1</label>
                      <input
                        type="text"
                        value={editData.facilityTK1 || ''}
                        onChange={(e) => handleEditChange('facilityTK1', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
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

export default DataKeluargaPage;