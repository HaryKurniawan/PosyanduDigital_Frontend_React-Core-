import React, { useState, useEffect } from 'react';
import MobileNavbar from '../components/MobileNavbar';
import {
  Calendar,
  Heart,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  User,
  History
} from 'lucide-react';
import {
  getUpcomingSchedules,
  getMyRegistrations,
  registerForPosyandu,
  cancelRegistration
} from '../services/posyanduService';
import { getFamilyData } from '../services/familyDataService';

// JadwalPage.jsx
// Full page for viewing schedules, registering children, and viewing history.

const JadwalPage = () => {
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [myChildren, setMyChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | registered | history

  useEffect(() => {
    fetchData();
  }, []);

  // ------------------- Helpers: extraction & normalization -------------------
  const extractChildrenFromFamilyData = (familyData) => {
    if (!familyData) return [];
    // common shapes: array, { children: [] }, { data: { children: [] } }, { family: { children: [] } }
    if (Array.isArray(familyData)) return familyData;
    if (Array.isArray(familyData.children)) return familyData.children;
    if (Array.isArray(familyData.data?.children)) return familyData.data.children;
    if (Array.isArray(familyData.family?.children)) return familyData.family.children;

    // fallback: if there's any key that is an array of objects, return it
    for (const key of Object.keys(familyData)) {
      if (Array.isArray(familyData[key]) && familyData[key].length > 0 && typeof familyData[key][0] === 'object') {
        return familyData[key];
      }
    }

    return [];
  };

  const normalizeChild = (c) => {
    if (!c) return null;
    return {
      id: c.id ?? c.childId ?? c._id ?? c.uuid,
      fullName: c.fullName ?? c.name ?? c.nama ?? `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim(),
      nik: c.nik ?? c.nikNumber ?? ''
    };
  };

  // ------------------- Fetch data -------------------
  const fetchData = async () => {
    try {
      setLoading(true);

      const [schedules, registrations, familyData] = await Promise.all([
        getUpcomingSchedules(),
        getMyRegistrations(),
        getFamilyData()
      ]);

      setUpcomingSchedules(schedules || []);
      setMyRegistrations(registrations || []);

      // Debug prints to help map structure while developing
      console.debug('JadwalPage.fetchData -> responses:', { schedules, registrations, familyData });

      const childrenFromRegs = (registrations || [])
        .map(r => r.child)
        .filter(Boolean);

      const childrenFromFamily = extractChildrenFromFamilyData(familyData);

      const allChildren = [...childrenFromRegs, ...childrenFromFamily]
        .map(normalizeChild)
        .filter(c => c && c.id)
        .reduce((acc, curr) => {
          if (!acc.find(x => String(x.id) === String(curr.id))) acc.push(curr);
          return acc;
        }, []);

      setMyChildren(allChildren);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal memuat data. Periksa koneksi atau coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // ------------------- Actions -------------------
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
      setActiveTab('registered');
    } catch (error) {
      console.error('Error registering:', error);
      alert(error?.response?.data?.message || 'Gagal mendaftar');
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

  // ------------------- Formatters & utils -------------------
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isRegistered = (scheduleId) => {
    return myRegistrations.some(r => (r.scheduleId === scheduleId || r.schedule?.id === scheduleId) && r.status !== 'CANCELLED');
  };

  const activeRegistrations = myRegistrations.filter(r => r.status === 'REGISTERED');
  const historyRegistrations = myRegistrations.filter(r => r.status === 'ATTENDED' || r.status === 'CANCELLED');

  // ------------------- Render -------------------
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
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Jadwal Posyandu</h1>
          <p className="text-sm text-gray-600">Lihat dan daftar jadwal posyandu</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm mb-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-3 rounded-xl font-semibold text-sm transition ${
                activeTab === 'upcoming'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4 inline mb-1" />
              <div className="text-xs mt-1">Mendatang</div>
              {upcomingSchedules.length > 0 && (
                <div className="text-xs mt-0.5 opacity-80">({upcomingSchedules.length})</div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('registered')}
              className={`py-3 rounded-xl font-semibold text-sm transition ${
                activeTab === 'registered'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="w-4 h-4 inline mb-1" />
              <div className="text-xs mt-1">Terdaftar</div>
              {activeRegistrations.length > 0 && (
                <div className="text-xs mt-0.5 opacity-80">({activeRegistrations.length})</div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 rounded-xl font-semibold text-sm transition ${
                activeTab === 'history'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4 inline mb-1" />
              <div className="text-xs mt-1">Riwayat</div>
              {historyRegistrations.length > 0 && (
                <div className="text-xs mt-0.5 opacity-80">({historyRegistrations.length})</div>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Upcoming */}
          {activeTab === 'upcoming' && (
            <div>
              {upcomingSchedules.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                  <Calendar className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Belum ada jadwal mendatang</p>
                </div>
              ) : (
                upcomingSchedules.map((schedule) => {
                  const registered = isRegistered(schedule.id);
                  const scheduleDate = schedule.scheduleDate ?? schedule.date ?? schedule.datetime;

                  return (
                    <div key={schedule.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-lg">{schedule.location}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(scheduleDate)} {schedule.startTime ? `, ${schedule.startTime}` : ''}
                          </div>

                          {schedule.description && (
                            <p className="text-sm text-gray-500 mt-2 bg-gray-50 rounded-lg p-2">{schedule.description}</p>
                          )}

                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                            <Users className="w-3 h-3" />
                            {(schedule._count?.registrations ?? schedule.registeredCount ?? 0)} orang terdaftar
                          </div>
                        </div>
                      </div>

                      {registered ? (
                        <div className="flex items-center justify-center gap-2 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          Sudah Terdaftar
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRegister(schedule)}
                          className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition"
                        >
                          Daftar Sekarang
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Registered */}
          {activeTab === 'registered' && (
            <div>
              {activeRegistrations.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                  <CheckCircle className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Belum ada pendaftaran aktif</p>
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition text-sm font-semibold"
                  >
                    Lihat Jadwal
                  </button>
                </div>
              ) : (
                activeRegistrations.map((registration) => (
                  <div key={registration.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-800 text-lg">{registration.child?.fullName ?? registration.child?.name ?? '-'}</p>
                            <p className="text-xs text-gray-500">NIK: {registration.child?.nik ?? '-'}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Terdaftar</span>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-3 mt-2">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <p className="text-sm font-semibold text-gray-800">{registration.schedule?.location ?? '-'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <p className="text-xs text-gray-600">{formatDate(registration.schedule?.scheduleDate ?? registration.schedule?.date)}</p>
                          </div>
                        </div>

                        {registration.notes && (
                          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                            <p className="text-xs text-blue-800"><span className="font-semibold">Catatan:</span> {registration.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelRegistration(registration.id)}
                      className="w-full py-2 bg-red-100 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-200 transition"
                    >
                      Batalkan Pendaftaran
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <div>
              {historyRegistrations.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                  <History className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Belum ada riwayat pendaftaran</p>
                </div>
              ) : (
                historyRegistrations.map((registration) => (
                  <div key={registration.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${registration.status === 'ATTENDED' ? 'bg-gradient-to-br from-green-100 to-emerald-100' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
                        {registration.status === 'ATTENDED' ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-gray-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-800 text-lg">{registration.child?.fullName ?? registration.child?.name ?? '-'}</p>
                            <p className="text-xs text-gray-500">NIK: {registration.child?.nik ?? '-'}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${registration.status === 'ATTENDED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {registration.status === 'ATTENDED' ? 'Hadir' : 'Dibatalkan'}
                          </span>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 mt-2">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <p className="text-sm font-semibold text-gray-800">{registration.schedule?.location ?? '-'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <p className="text-xs text-gray-600">{formatDate(registration.schedule?.scheduleDate ?? registration.schedule?.date)}</p>
                          </div>
                        </div>

                        {registration.notes && (
                          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                            <p className="text-xs text-blue-800"><span className="font-semibold">Catatan:</span> {registration.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Daftar Posyandu</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedSchedule?.location} - {formatDate(selectedSchedule?.scheduleDate ?? selectedSchedule?.date ?? selectedSchedule?.datetime)}</p>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Anak</label>

              {myChildren.length === 0 && (
                <div className="mb-3">
                  <p className="text-xs text-red-600 mb-2">Belum ada data anak. Silakan lengkapi profil keluarga terlebih dahulu.</p>
                  <a href="/profile/family" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold">Lengkapi Profil</a>
                </div>
              )}

              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Pilih Anak --</option>
                {myChildren.map((child) => (
                  <option key={child.id} value={child.id}>{child.fullName}{child.nik ? ` — ${child.nik}` : ''}</option>
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
