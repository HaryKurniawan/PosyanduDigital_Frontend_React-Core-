// File: frontend/src/pages/RiwayatPemeriksaanPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Activity, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { getMyChildrenExaminations } from '../services/posyanduService';

const RiwayatPemeriksaanPage = () => {
  const navigate = useNavigate();
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedChild, setSelectedChild] = useState('all');
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
        children[exam.child.nik] = exam.child.fullName;
      }
    });
    return children;
  };

  const filteredExaminations = selectedChild === 'all' 
    ? examinations 
    : examinations.filter(exam => exam.child.nik === selectedChild);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-purple-600 text-lg">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full text-center">
          <Activity className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchExaminations}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Riwayat Pemeriksaan</h1>
        </div>
        
        {/* Filter Anak */}
        {examinations.length > 0 && Object.keys(getUniqueChildren()).length > 1 && (
          <div className="mt-4">
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all" className="text-gray-800">Semua Anak</option>
              {Object.entries(getUniqueChildren()).map(([nik, name]) => (
                <option key={nik} value={nik} className="text-gray-800">
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {filteredExaminations.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Belum ada riwayat pemeriksaan</p>
            <p className="text-sm text-gray-400">
              Data pemeriksaan akan muncul setelah kunjungan posyandu
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExaminations.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                {/* Header Card */}
                <div
                  onClick={() => setExpandedId(expandedId === exam.id ? null : exam.id)}
                  className="p-4 cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-gray-800">{exam.child.fullName}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(exam.examinationDate)}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        📍 {exam.schedule.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Berat</div>
                        <div className="font-bold text-purple-600">{exam.weight} kg</div>
                      </div>
                      {expandedId === exam.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === exam.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-purple-50 p-3 rounded-xl">
                        <div className="text-xs text-gray-600 mb-1">Berat Badan</div>
                        <div className="text-lg font-bold text-purple-600">{exam.weight} kg</div>
                      </div>
                      <div className="bg-pink-50 p-3 rounded-xl">
                        <div className="text-xs text-gray-600 mb-1">Tinggi Badan</div>
                        <div className="text-lg font-bold text-pink-600">{exam.height} cm</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-xl">
                        <div className="text-xs text-gray-600 mb-1">Lingkar Kepala</div>
                        <div className="text-lg font-bold text-blue-600">{exam.headCircumference} cm</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-xl">
                        <div className="text-xs text-gray-600 mb-1">Lingkar Lengan</div>
                        <div className="text-lg font-bold text-green-600">{exam.armCircumference} cm</div>
                      </div>
                    </div>

                    {/* Imunisasi */}
                    <div className="bg-orange-50 p-3 rounded-xl mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">💉</span>
                        <div className="text-xs text-gray-600">Imunisasi</div>
                      </div>
                      <div className="font-semibold text-orange-600">
                        {exam.immunization === '-' ? 'Tidak ada imunisasi' : exam.immunization}
                      </div>
                    </div>

                    {/* Catatan */}
                    {exam.notes && (
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <div className="text-xs text-gray-600 mb-1">Catatan</div>
                        <div className="text-sm text-gray-700">{exam.notes}</div>
                      </div>
                    )}

                    {/* Info Usia */}
                    <div className="mt-3 text-xs text-gray-500 text-center">
                      Usia saat pemeriksaan: {calculateAge(exam.child.birthDate)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiwayatPemeriksaanPage;