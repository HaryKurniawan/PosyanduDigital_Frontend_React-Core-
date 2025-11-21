import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft, Search, User, Calendar, Check, AlertCircle, Users, Syringe, Plus, X } from 'lucide-react';
import { 
  searchChildByNIK, 
  createExamination, 
  getAllChildren,
  getAllImmunizationTemplates 
} from '../../services/posyanduService';

const InputPemeriksaanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scheduleId } = useParams();
  const [step, setStep] = useState(1);
  const [nik, setNik] = useState('');
  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allChildren, setAllChildren] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // ✅ UPDATED - Immunization state with multiple vaccines
  const [immunizationTemplates, setImmunizationTemplates] = useState([]);
  const [vaccineOptions, setVaccineOptions] = useState([]);
  const [selectedVaccines, setSelectedVaccines] = useState([]); // Array of vaccine IDs
  
  const [examData, setExamData] = useState({
    weight: '',
    height: '',
    headCircumference: '',
    armCircumference: '',
    notes: ''
  });

  useEffect(() => {
    fetchImmunizationTemplates();
    
    if (location.state?.selectedChild) {
      setChildData(location.state.selectedChild);
      setStep(2);
    } else {
      fetchAllChildren();
    }
  }, [location.state]);

  const fetchAllChildren = async () => {
    try {
      setLoading(true);
      const data = await getAllChildren();
      setAllChildren(data);
    } catch (error) {
      console.error('Error fetching children:', error);
      alert('Gagal memuat data anak');
    } finally {
      setLoading(false);
    }
  };

  const fetchImmunizationTemplates = async () => {
    try {
      const templates = await getAllImmunizationTemplates();
      setImmunizationTemplates(templates);
      
      // Build vaccine options from templates
      const options = [];
      
      templates.forEach(template => {
        template.vaccines.forEach(vaccine => {
          options.push({
            id: vaccine.id,
            name: vaccine.name,
            dose: vaccine.dose,
            description: vaccine.description,
            ageRange: template.ageRange,
            recommendedAge: vaccine.recommendedAge
          });
        });
      });
      
      setVaccineOptions(options);
    } catch (error) {
      console.error('Error fetching immunization templates:', error);
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

  // ✅ NEW - Toggle vaccine selection
  const handleVaccineToggle = (vaccineId) => {
    setSelectedVaccines(prev => {
      if (prev.includes(vaccineId)) {
        return prev.filter(id => id !== vaccineId);
      } else {
        return [...prev, vaccineId];
      }
    });
  };

  // ✅ UPDATED - Submit with multiple vaccines
  const handleSubmitExamination = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Build immunization string for display
      let immunizationString = '-';
      if (selectedVaccines.length > 0) {
        const vaccineNames = selectedVaccines
          .map(id => {
            const vaccine = vaccineOptions.find(v => v.id === id);
            return vaccine ? `${vaccine.name} (Dosis ${vaccine.dose})` : null;
          })
          .filter(Boolean);
        
        immunizationString = vaccineNames.join(', ');
      }
      
      // ✅ Send vaccineIds array to backend
      await createExamination({
        childId: childData.id,
        scheduleId,
        weight: examData.weight,
        height: examData.height,
        headCircumference: examData.headCircumference,
        armCircumference: examData.armCircumference,
        immunization: immunizationString,
        vaccineIds: selectedVaccines, // ✅ NEW - Array of vaccine IDs
        notes: examData.notes
      });
      
      alert(`Pemeriksaan berhasil disimpan!\n${selectedVaccines.length} vaksin tercatat.`);
      navigate(`/admin/kelola-jadwal/${scheduleId}`);
    } catch (error) {
      console.error('Error saving examination:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan data pemeriksaan');
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

  const handleBack = () => {
    if (step === 1) {
      navigate(`/admin/kelola-jadwal/${scheduleId}`);
    } else if (step === 2 && location.state?.selectedChild) {
      navigate(`/admin/kelola-jadwal/${scheduleId}`);
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
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
                    <p className="text-sm text-blue-800">Ibu: {childData.user?.motherData?.fullName || '-'}</p>
                    <p className="text-sm text-blue-800">Ayah: {childData.user?.spouseData?.fullName || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (location.state?.selectedChild) {
                    navigate(`/admin/kelola-jadwal/${scheduleId}`);
                  } else {
                    setStep(1);
                    setChildData(null);
                    setNik('');
                  }
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
              >
                {location.state?.selectedChild ? 'Batal' : 'Cari Ulang'}
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

            <form onSubmit={handleSubmitExamination} className="space-y-6">
              {/* Anthropometric Data */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  Data Antropometri
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Berat Badan (kg) *
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
                      Tinggi Badan (cm) *
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
                      Lingkar Kepala (cm) *
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
                      Lingkar Lengan (cm) *
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
              </div>

              {/* ✅ NEW - Vaccines Selection with Checkbox */}
              <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Syringe className="w-4 h-4 text-green-600" />
                  </div>
                  Vaksin yang Diberikan
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pilih vaksin yang diberikan saat pemeriksaan (bisa lebih dari 1)
                </p>
                
                <div className="max-h-80 overflow-y-auto border-2 border-gray-200 rounded-xl p-4 space-y-2 bg-gray-50">
                  {vaccineOptions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Syringe className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>Belum ada data vaksin tersedia</p>
                    </div>
                  ) : (
                    vaccineOptions.map(vaccine => (
                      <label
                        key={vaccine.id}
                        className="flex items-start gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition border-2 border-transparent hover:border-green-300"
                      >
                        <input
                          type="checkbox"
                          checked={selectedVaccines.includes(vaccine.id)}
                          onChange={() => handleVaccineToggle(vaccine.id)}
                          className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{vaccine.name}</p>
                          <p className="text-xs text-gray-600 mb-1">{vaccine.description}</p>
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                              {vaccine.ageRange}
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Dosis {vaccine.dose}
                            </span>
                            <span className="text-xs text-gray-500">
                              {vaccine.recommendedAge}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>

                {/* ✅ Selected Vaccines Summary */}
                {selectedVaccines.length > 0 && (
                  <div className="mt-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-green-900">
                        {selectedVaccines.length} vaksin dipilih
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedVaccines.map(vaccineId => {
                        const vaccine = vaccineOptions.find(v => v.id === vaccineId);
                        return vaccine ? (
                          <div
                            key={vaccineId}
                            className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 border border-green-300"
                          >
                            <Syringe className="w-3 h-3 text-green-600" />
                            {vaccine.name}
                            <button
                              type="button"
                              onClick={() => handleVaccineToggle(vaccineId)}
                              className="ml-1 text-red-500 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Vaksin yang dipilih akan otomatis tercatat di roadmap imunisasi anak
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan Pemeriksaan (Opsional)
                </label>
                <textarea
                  placeholder="Tambahkan catatan pemeriksaan..."
                  value={examData.notes}
                  onChange={(e) => setExamData({...examData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-6 h-6" />
                {loading ? 'Menyimpan...' : 'Simpan Pemeriksaan & Vaksin'}
              </button>

              {/* Info Box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Yang akan disimpan:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Data antropometri (BB, TB, LK, LL)</li>
                      <li>Vaksin yang diberikan ({selectedVaccines.length} vaksin)</li>
                      <li>Catatan pemeriksaan</li>
                    </ul>
                    <p className="mt-2 font-semibold text-green-700">
                      ✓ Roadmap imunisasi akan terupdate otomatis
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputPemeriksaanPage;