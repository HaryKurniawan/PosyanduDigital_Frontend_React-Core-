import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Activity, Syringe, TrendingUp, Baby } from 'lucide-react';
import { getMyChildrenExaminations } from '../services/posyanduService';
import PageHeader from '../components/PageHeader';

const RiwayatPemeriksaanPage = () => {
  const navigate = useNavigate();
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState('all');
  const [activeTab, setActiveTab] = useState('immunizations'); // immunizations | examinations
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExaminations();
  }, []);

  const fetchExaminations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyChildrenExaminations();
      setExaminations(data);
    } catch (error) {
      console.error('Error fetching examinations:', error);
      setError('Gagal memuat data pemeriksaan');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
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

  const getUniqueChildren = () => {
    const children = {};
    examinations.forEach(exam => {
      if (!children[exam.child.nik]) {
        children[exam.child.nik] = {
          name: exam.child.fullName,
          birthDate: exam.child.birthDate
        };
      }
    });
    return children;
  };

  const getLatestExamByChild = () => {
    const latestExams = {};
    examinations.forEach(exam => {
      const nik = exam.child.nik;
      if (!latestExams[nik] || new Date(exam.examinationDate) > new Date(latestExams[nik].examinationDate)) {
        latestExams[nik] = exam;
      }
    });
    return Object.values(latestExams);
  };

  const filteredExaminations = selectedChild === 'all'
    ? examinations
    : examinations.filter(exam => exam.child.nik === selectedChild);

  const immunizationHistory = filteredExaminations
    .filter(exam => exam.immunization && exam.immunization !== '-')
    .sort((a, b) => new Date(b.examinationDate) - new Date(a.examinationDate));

  const latestExams = getLatestExamByChild();

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

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-gray-50 rounded-2xl p-6 max-w-md w-full text-center border border-gray-100">
          <Activity className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchExaminations}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-6">
      <PageHeader title="Riwayat Kesehatan" backTo="/home" />

      <div className="px-4 py-4">
        {examinations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Belum ada riwayat pemeriksaan</p>
            <p className="text-sm text-gray-400">
              Data pemeriksaan akan muncul setelah kunjungan posyandu
            </p>
          </div>
        ) : (
          <>
            {/* Latest Examination Cards */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3 px-1">Data Terkini</h2>
              <div className="space-y-3">
                {latestExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white rounded-2xl shadow-md p-4"
                  >
                    {/* Child Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Baby className="w-7 h-7 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-1">{exam.child.fullName}</h3>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Usia:</span> {calculateAge(exam.child.birthDate)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Pemeriksaan terakhir: {formatDate(exam.examinationDate)}
                        </p>
                      </div>
                    </div>

                    {/* Measurement Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">⚖️</span>
                          <div className="text-xs text-gray-600">Berat Badan</div>
                        </div>
                        <div className="text-xl font-bold text-purple-700">{exam.weight} kg</div>
                      </div>
                      <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">📏</span>
                          <div className="text-xs text-gray-600">Tinggi Badan</div>
                        </div>
                        <div className="text-xl font-bold text-pink-700">{exam.height} cm</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">👶</span>
                          <div className="text-xs text-gray-600">Lingkar Kepala</div>
                        </div>
                        <div className="text-xl font-bold text-blue-700">{exam.headCircumference} cm</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">💪</span>
                          <div className="text-xs text-gray-600">Lingkar Lengan</div>
                        </div>
                        <div className="text-xl font-bold text-green-700">{exam.armCircumference} cm</div>
                      </div>
                    </div>

                    {/* Latest Immunization */}
                    {exam.immunization && exam.immunization !== '-' && (
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Syringe className="w-4 h-4 text-orange-600" />
                          <div className="text-xs text-gray-600">Imunisasi Terakhir</div>
                        </div>
                        <div className="font-bold text-orange-700">{exam.immunization}</div>
                      </div>
                    )}

                    {/* Notes */}
                    {exam.notes && (
                      <div className="mt-3 bg-gray-50 border border-gray-200 p-3 rounded-xl">
                        <div className="text-xs text-gray-600 mb-1 font-semibold">Catatan</div>
                        <div className="text-sm text-gray-700">{exam.notes}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Anak */}
            {Object.keys(getUniqueChildren()).length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2 px-1">
                  Filter berdasarkan anak
                </label>
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                >
                  <option value="all">Semua Anak</option>
                  {Object.entries(getUniqueChildren()).map(([nik, data]) => (
                    <option key={nik} value={nik}>
                      {data.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-2xl p-2 shadow-sm mb-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTab('immunizations')}
                  className={`py-3 rounded-xl font-semibold text-sm transition ${activeTab === 'immunizations'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Syringe className="w-4 h-4 inline mb-1" />
                  <div className="text-xs mt-1">Riwayat Imunisasi</div>
                  <div className="text-xs mt-0.5 opacity-80">({immunizationHistory.length})</div>
                </button>

                <button
                  onClick={() => setActiveTab('examinations')}
                  className={`py-3 rounded-xl font-semibold text-sm transition ${activeTab === 'examinations'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <TrendingUp className="w-4 h-4 inline mb-1" />
                  <div className="text-xs mt-1">Riwayat Pemeriksaan</div>
                  <div className="text-xs mt-0.5 opacity-80">({filteredExaminations.length})</div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-3">
              {/* Immunizations Tab */}
              {activeTab === 'immunizations' && (
                <>
                  {immunizationHistory.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                      <Syringe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Belum ada riwayat imunisasi</p>
                    </div>
                  ) : (
                    immunizationHistory.map((exam) => (
                      <div
                        key={exam.id}
                        className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Syringe className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-bold text-gray-800 text-lg mb-1">{exam.immunization}</h4>
                                <p className="text-sm text-gray-600">{exam.child.fullName}</p>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>{formatDate(exam.examinationDate)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="text-gray-500">📍</span>
                                <span>{exam.schedule.location}</span>
                              </div>
                            </div>

                            {exam.notes && (
                              <div className="mt-3 bg-blue-50 border border-blue-100 p-3 rounded-xl">
                                <p className="text-xs text-gray-600 mb-1 font-semibold">Catatan</p>
                                <p className="text-sm text-gray-700">{exam.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* Examinations Tab */}
              {activeTab === 'examinations' && (
                <>
                  {filteredExaminations.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                      <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Belum ada riwayat pemeriksaan</p>
                    </div>
                  ) : (
                    filteredExaminations.map((exam) => (
                      <div
                        key={exam.id}
                        className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
                      >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-base mb-1">{exam.child.fullName}</h4>
                            <p className="text-sm text-gray-600">{formatDate(exam.examinationDate)}</p>
                            <p className="text-xs text-gray-500 mt-1">📍 {exam.schedule.location}</p>
                          </div>
                        </div>

                        {/* Measurements */}
                        <div className="bg-gray-50 rounded-xl p-3 mb-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Berat Badan</p>
                              <p className="text-lg font-bold text-gray-800">{exam.weight} kg</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Tinggi Badan</p>
                              <p className="text-lg font-bold text-gray-800">{exam.height} cm</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Lingkar Kepala</p>
                              <p className="text-lg font-bold text-gray-800">{exam.headCircumference} cm</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Lingkar Lengan</p>
                              <p className="text-lg font-bold text-gray-800">{exam.armCircumference} cm</p>
                            </div>
                          </div>
                        </div>

                        {/* Immunization if exists */}
                        {exam.immunization && exam.immunization !== '-' && (
                          <div className="bg-purple-50 border border-purple-100 p-3 rounded-xl mb-3">
                            <div className="flex items-center gap-2">
                              <Syringe className="w-4 h-4 text-purple-600" />
                              <span className="text-sm text-gray-600">Imunisasi:</span>
                              <span className="text-sm font-semibold text-gray-800">{exam.immunization}</span>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {exam.notes && (
                          <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1 font-semibold">Catatan</p>
                            <p className="text-sm text-gray-700">{exam.notes}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RiwayatPemeriksaanPage;