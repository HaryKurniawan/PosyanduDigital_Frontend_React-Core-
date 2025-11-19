import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Search, User, Calendar, Check, AlertCircle, Users } from 'lucide-react';
import { searchChildByNIK, createExamination, getAllChildren } from '../../services/posyanduService';

const InputPemeriksaanPage = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const [step, setStep] = useState(1); // 1: search/list, 2: verify, 3: input
  const [nik, setNik] = useState('');
  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allChildren, setAllChildren] = useState([]);
  const [searchMode, setSearchMode] = useState(false); // toggle between list and search
  const [searchQuery, setSearchQuery] = useState('');
  const [examData, setExamData] = useState({
    weight: '',
    height: '',
    headCircumference: '',
    armCircumference: '',
    immunization: '-',
    notes: ''
  });

  const immunizationOptions = [
    '-',
    'BCG',
    'Hepatitis B',
    'Polio 1',
    'Polio 2',
    'Polio 3',
    'Polio 4',
    'DPT-HB-Hib 1',
    'DPT-HB-Hib 2',
    'DPT-HB-Hib 3',
    'Campak/MR 1',
    'Campak/MR 2'
  ];

  // Fetch all children on mount
  useEffect(() => {
    fetchAllChildren();
  }, []);

  const fetchAllChildren = async () => {
    try {
      setLoading(true);
      const data = await getAllChildren();
      setAllChildren(data);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await searchChildByNIK(nik);
      setChildData(data);
      setStep(2);
    } catch (error) {
      console.error('Error searching child:', error);
      alert('Data anak tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChild = async (child) => {
    try {
      setLoading(true);
      const data = await searchChildByNIK(child.nik);
      setChildData(data);
      setStep(2);
    } catch (error) {
      console.error('Error loading child:', error);
      alert('Gagal memuat data anak');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExamination = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createExamination({
        childId: childData.id,
        scheduleId,
        ...examData
      });
      alert('Data pemeriksaan berhasil disimpan!');
      navigate('/admin/kelola-jadwal');
    } catch (error) {
      console.error('Error saving examination:', error);
      alert('Gagal menyimpan data pemeriksaan');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
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

  const filteredChildren = allChildren.filter(child =>
    child.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    child.nik.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => step === 1 ? navigate('/admin/kelola-jadwal') : setStep(step - 1)}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Input Pemeriksaan</h1>
            <p className="text-sm text-white/80 mt-1">
              {step === 1 && 'Pilih anak untuk diperiksa'}
              {step === 2 && 'Verifikasi data'}
              {step === 3 && 'Input hasil pemeriksaan'}
            </p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center gap-2 p-4">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 max-w-24 rounded-full transition ${
              s <= step ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Step 1: List/Search */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Toggle Buttons */}
            <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm">
              <button
                onClick={() => setSearchMode(false)}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  !searchMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Daftar Anak
              </button>
              <button
                onClick={() => setSearchMode(true)}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  searchMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Search className="w-4 h-4 inline mr-2" />
                Cari NIK
              </button>
            </div>

            {/* Search by NIK Mode */}
            {searchMode ? (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Cari Data Anak</h2>
                  <p className="text-gray-600 text-sm">Masukkan NIK anak untuk memulai pemeriksaan</p>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      NIK Anak
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan 16 digit NIK"
                      value={nik}
                      onChange={(e) => setNik(e.target.value)}
                      maxLength={16}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || nik.length !== 16}
                    className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Mencari...' : 'Cari Data'}
                  </button>
                </form>
              </div>
            ) : (
              /* Children List Mode */
              <div className="space-y-4">
                {/* Search Filter */}
                <div className="bg-white rounded-xl shadow-sm p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari nama atau NIK anak..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Children Cards */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-purple-600">Memuat data...</div>
                  </div>
                ) : filteredChildren.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchQuery ? 'Tidak ada anak yang cocok' : 'Belum ada data anak'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredChildren.map((child) => (
                      <div
                        key={child.id}
                        onClick={() => handleSelectChild(child)}
                        className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-lg mb-1">{child.fullName}</h3>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">NIK:</span> {child.nik}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Lahir:</span> {formatDate(child.birthDate)}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Usia:</span> {calculateAge(child.birthDate)}
                              </p>
                              <p className="text-sm text-gray-500">
                                <span className="font-semibold">Orang Tua:</span> {child.user?.name || '-'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-purple-600">
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Info Total */}
                {!loading && filteredChildren.length > 0 && (
                  <div className="text-center text-sm text-gray-500">
                    Menampilkan {filteredChildren.length} dari {allChildren.length} anak
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Verify */}
        {step === 2 && childData && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{childData.fullName}</h2>
                  <p className="text-sm text-gray-600">NIK: {childData.nik}</p>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tanggal Lahir</span>
                  <span className="text-sm font-semibold text-gray-800">{formatDate(childData.birthDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Usia</span>
                  <span className="text-sm font-semibold text-gray-800">{calculateAge(childData.birthDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tempat Lahir</span>
                  <span className="text-sm font-semibold text-gray-800">{childData.birthPlace}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Golongan Darah</span>
                  <span className="text-sm font-semibold text-gray-800">{childData.bloodType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Anak Ke</span>
                  <span className="text-sm font-semibold text-gray-800">{childData.childOrder}</span>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">Data Orang Tua</p>
                    <p className="text-sm text-blue-800">Ibu: {childData.user.motherData?.fullName || '-'}</p>
                    <p className="text-sm text-blue-800">Ayah: {childData.user.spouseData?.fullName || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setChildData(null);
                  setNik('');
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
              >
                Cari Ulang
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold"
              >
                Data Benar, Lanjut
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Input Examination */}
        {step === 3 && childData && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="mb-6 bg-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Pemeriksaan untuk:</p>
              <p className="font-bold text-gray-800">{childData.fullName}</p>
            </div>

            <form onSubmit={handleSubmitExamination} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Berat Badan (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="12.5"
                    value={examData.weight}
                    onChange={(e) => setExamData({...examData, weight: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tinggi Badan (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="85.5"
                    value={examData.height}
                    onChange={(e) => setExamData({...examData, height: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lingkar Kepala (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="48.5"
                    value={examData.headCircumference}
                    onChange={(e) => setExamData({...examData, headCircumference: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lingkar Lengan (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="15.2"
                    value={examData.armCircumference}
                    onChange={(e) => setExamData({...examData, armCircumference: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imunisasi
                </label>
                <select
                  value={examData.immunization}
                  onChange={(e) => setExamData({...examData, immunization: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {immunizationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === '-' ? 'Tidak ada imunisasi' : option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  placeholder="Tambahkan catatan pemeriksaan..."
                  value={examData.notes}
                  onChange={(e) => setExamData({...examData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                {loading ? 'Menyimpan...' : 'Simpan Pemeriksaan'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputPemeriksaanPage;