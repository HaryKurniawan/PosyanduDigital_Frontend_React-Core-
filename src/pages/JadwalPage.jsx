import React, { useState, useEffect } from 'react';
import MobileNavbar from '../components/MobileNavbar';
import { Calendar, Heart, ChevronRight, MapPin, Clock, Users, CheckCircle, XCircle, User } from 'lucide-react';
import { getUpcomingSchedules, getMyRegistrations, registerForPosyandu, cancelRegistration } from '../services/posyanduService';

const JadwalPage = () => {
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [myChildren, setMyChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedules, registrations] = await Promise.all([
        getUpcomingSchedules(),
        getMyRegistrations()
      ]);
      
      setUpcomingSchedules(schedules);
      setMyRegistrations(registrations);
      
      // Extract unique children from user data
      if (registrations.length > 0) {
        const children = registrations.map(r => r.child);
        const uniqueChildren = Array.from(new Map(children.map(c => [c.id, c])).values());
        setMyChildren(uniqueChildren);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (schedule) => {
    setSelectedSchedule(schedule);
    setShowRegisterModal(true);
  };

  const submitRegistration = async () => {
    if (!selectedChild) {
      alert('Pilih anak terlebih dahulu');
      return;
    }

    try {
      await registerForPosyandu({
        scheduleId: selectedSchedule.id,
        childId: selectedChild
      });
      alert('Pendaftaran berhasil!');
      setShowRegisterModal(false);
      setSelectedChild('');
      fetchData();
    } catch (error) {
      console.error('Error registering:', error);
      alert(error.response?.data?.message || 'Gagal mendaftar');
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm('Yakin ingin membatalkan pendaftaran?')) return;

    try {
      await cancelRegistration(registrationId);
      alert('Pendaftaran dibatalkan');
      fetchData();
    } catch (error) {
      console.error('Error cancelling:', error);
      alert('Gagal membatalkan pendaftaran');
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

  const isRegistered = (scheduleId) => {
    return myRegistrations.some(r => r.scheduleId === scheduleId && r.status !== 'CANCELLED');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      <MobileNavbar />
      
      <div className="pt-20 pb-24 px-4">
        {/* My Registrations */}
        {myRegistrations.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Pendaftaran Saya
            </h3>
            <div className="space-y-3">
              {myRegistrations.map((registration) => (
                <div 
                  key={registration.id} 
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{registration.child.fullName}</p>
                      <p className="text-xs text-gray-600 mt-1">{registration.schedule.location}</p>
                      <p className="text-xs text-gray-500">{formatDate(registration.schedule.scheduleDate)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      registration.status === 'REGISTERED' ? 'bg-blue-100 text-blue-700' :
                      registration.status === 'ATTENDED' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {registration.status === 'REGISTERED' ? 'Terdaftar' :
                       registration.status === 'ATTENDED' ? 'Hadir' : 'Dibatalkan'}
                    </span>
                  </div>
                  {registration.status === 'REGISTERED' && (
                    <button
                      onClick={() => handleCancelRegistration(registration.id)}
                      className="mt-2 w-full py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition"
                    >
                      Batalkan Pendaftaran
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Schedules */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Jadwal Posyandu Mendatang
          </h3>
          <div className="space-y-3">
            {upcomingSchedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Belum ada jadwal mendatang</p>
              </div>
            ) : (
              upcomingSchedules.map((schedule) => {
                const registered = isRegistered(schedule.id);
                return (
                  <div 
                    key={schedule.id} 
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{schedule.location}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(schedule.scheduleDate)}
                        </div>
                        {schedule.description && (
                          <p className="text-xs text-gray-500 mt-1">{schedule.description}</p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Users className="w-3 h-3" />
                          {schedule._count.registrations} terdaftar
                        </div>
                      </div>
                    </div>
                    
                    {registered ? (
                      <div className="flex items-center justify-center gap-2 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Sudah Terdaftar
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRegister(schedule)}
                        className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
                      >
                        Daftar Sekarang
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Daftar Posyandu</h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedSchedule?.location} - {formatDate(selectedSchedule?.scheduleDate)}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Anak
              </label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Pilih Anak --</option>
                {myChildren.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.fullName}
                  </option>
                ))}
                </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setSelectedChild('');
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
              >
                Batal
              </button>
              <button
                onClick={submitRegistration}
                disabled={!selectedChild}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Daftar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JadwalPage;