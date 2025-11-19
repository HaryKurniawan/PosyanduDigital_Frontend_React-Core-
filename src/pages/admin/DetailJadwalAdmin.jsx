import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, Users, CheckCircle, FileText, User, Phone, Baby, Clock } from 'lucide-react';
import { getScheduleDetail } from '../../services/posyanduService';

const DetailJadwalAdmin = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('registrations'); // registrations | examinations

  useEffect(() => {
    fetchScheduleDetail();
  }, [scheduleId]);

  const fetchScheduleDetail = async () => {
    try {
      setLoading(true);
      const data = await getScheduleDetail(scheduleId);
      setSchedule(data);
    } catch (error) {
      console.error('Error fetching schedule detail:', error);
      alert('Gagal memuat detail jadwal');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'REGISTERED':
        return 'bg-blue-100 text-blue-700';
      case 'ATTENDED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'REGISTERED':
        return 'Terdaftar';
      case 'ATTENDED':
        return 'Hadir';
      case 'CANCELLED':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Jadwal tidak ditemukan</p>
          <button
            onClick={() => navigate('/admin/kelola-jadwal')}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            Kembali
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
            onClick={() => navigate('/admin/kelola-jadwal')}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Detail Jadwal</h1>
            <p className="text-sm text-white/80 mt-1">Informasi lengkap jadwal posyandu</p>
          </div>
        </div>

        {/* Schedule Info Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold">{schedule.location}</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(schedule.scheduleDate)}</span>
          </div>
          {schedule.description && (
            <div className="flex items-start gap-2 text-white/80">
              <FileText className="w-4 h-4 mt-0.5" />
              <span className="text-sm">{schedule.description}</span>
            </div>
          )}
          
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/20">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-xs text-white/80">Terdaftar</p>
              <p className="text-2xl font-bold">{schedule.registrations?.length || 0}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-xs text-white/80">Diperiksa</p>
              <p className="text-2xl font-bold">{schedule.examinations?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              activeTab === 'registrations'
                ? 'bg-purple-600 text-white'
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Pendaftar ({schedule.registrations?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('examinations')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              activeTab === 'examinations'
                ? 'bg-purple-600 text-white'
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Pemeriksaan ({schedule.examinations?.length || 0})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-4">
        {activeTab === 'registrations' ? (
          /* Registrations Tab */
          <div className="space-y-3">
            {schedule.registrations?.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada pendaftar</p>
              </div>
            ) : (
              schedule.registrations
                .filter(reg => reg.status !== 'CANCELLED')
                .map((registration) => (
                  <div
                    key={registration.id}
                    className="bg-white rounded-2xl shadow-sm p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Baby className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">
                              {registration.child.fullName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              NIK: {registration.child.nik}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(registration.status)}`}>
                            {getStatusText(registration.status)}
                          </span>
                        </div>

                        <div className="space-y-1 mb-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Lahir:</span> {formatDate(registration.child.birthDate)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Usia:</span> {calculateAge(registration.child.birthDate)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Orang Tua:</span> {registration.child.user?.name || '-'}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          Terdaftar {formatDate(registration.registeredAt)} • {formatTime(registration.registeredAt)}
                        </div>

                        {registration.notes && (
                          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                            <p className="text-xs text-blue-800">
                              <span className="font-semibold">Catatan:</span> {registration.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    {registration.status === 'REGISTERED' && (
                      <button
                        onClick={() => navigate(`/admin/input-pemeriksaan/${scheduleId}`)}
                        className="mt-3 w-full py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold text-sm"
                      >
                        Input Pemeriksaan
                      </button>
                    )}
                  </div>
                ))
            )}
          </div>
        ) : (
          /* Examinations Tab */
          <div className="space-y-3">
            {schedule.examinations?.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada pemeriksaan</p>
              </div>
            ) : (
              schedule.examinations.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-2xl shadow-sm p-4"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        {exam.child.fullName}
                      </h3>
                      <p className="text-sm text-gray-600">NIK: {exam.child.nik}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(exam.examinationDate)} • {formatTime(exam.examinationDate)}
                      </p>
                    </div>
                  </div>

                  {/* Measurement Data */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Berat Badan</p>
                      <p className="text-lg font-bold text-gray-800">{exam.weight} kg</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Tinggi Badan</p>
                      <p className="text-lg font-bold text-gray-800">{exam.height} cm</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Lingkar Kepala</p>
                      <p className="text-lg font-bold text-gray-800">{exam.headCircumference} cm</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Lingkar Lengan</p>
                      <p className="text-lg font-bold text-gray-800">{exam.armCircumference} cm</p>
                    </div>
                  </div>

                  {/* Immunization */}
                  {exam.immunization && exam.immunization !== '-' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                      <p className="text-xs text-gray-600 mb-1">Imunisasi</p>
                      <p className="text-sm font-semibold text-green-800">{exam.immunization}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {exam.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Catatan</p>
                      <p className="text-sm text-gray-800">{exam.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate(`/admin/input-pemeriksaan/${scheduleId}`)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition flex items-center justify-center"
      >
        <FileText className="w-6 h-6" />
      </button>
    </div>
  );
};

export default DetailJadwalAdmin;