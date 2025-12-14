import React, { useState, useEffect } from 'react';
import MobileNavbar from '../components/MobileNavbar';
import SlidingTabs from '../components/SlidingTabs';
import {
  Calendar,
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

const JadwalPage = () => {
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [myChildren, setMyChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchData();
  }, []);

  const extractChildrenFromFamilyData = (familyData) => {
    if (!familyData) return [];
    if (Array.isArray(familyData)) return familyData;
    if (Array.isArray(familyData.children)) return familyData.children;
    if (Array.isArray(familyData.data?.children)) return familyData.data.children;
    if (Array.isArray(familyData.family?.children)) return familyData.family.children;
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

      const childrenFromRegs = (registrations || []).map(r => r.child).filter(Boolean);
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
      setActiveTab('registered');
    } catch (error) {
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
      alert('Gagal membatalkan pendaftaran');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isRegistered = (scheduleId) => {
    return myRegistrations.some(r => (r.scheduleId === scheduleId || r.schedule?.id === scheduleId) && r.status !== 'CANCELLED');
  };

  const activeRegistrations = myRegistrations.filter(r => r.status === 'REGISTERED');
  const historyRegistrations = myRegistrations.filter(r => r.status === 'ATTENDED' || r.status === 'CANCELLED');

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
      <MobileNavbar />

      <div className="pt-16 pb-20 px-4">


        {/* Tabs with Sliding Indicator */}
        <SlidingTabs
          tabs={[
            { id: 'upcoming', label: 'Mendatang', icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: 'registered', label: 'Terdaftar', icon: <CheckCircle className="w-3.5 h-3.5" /> },
            { id: 'history', label: 'Riwayat', icon: <History className="w-3.5 h-3.5" /> }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content */}
        <div className="space-y-3">
          {/* Upcoming */}
          {activeTab === 'upcoming' && (
            <div>
              {upcomingSchedules.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                  <p className="text-gray-400 text-sm">Belum ada jadwal mendatang</p>
                </div>
              ) : (
                upcomingSchedules.map((schedule) => {
                  const registered = isRegistered(schedule.id);
                  const scheduleDate = schedule.scheduleDate ?? schedule.date ?? schedule.datetime;

                  return (
                    <div key={schedule.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-pink-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{schedule.location}</p>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatDate(scheduleDate)} {schedule.startTime ? `, ${schedule.startTime}` : ''}
                          </div>
                          {schedule.description && (
                            <p className="text-[10px] text-gray-400 mt-1">{schedule.description}</p>
                          )}
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                            <Users className="w-3 h-3" />
                            {(schedule._count?.registrations ?? schedule.registeredCount ?? 0)} terdaftar
                          </div>
                        </div>
                      </div>

                      {registered ? (
                        <div className="flex items-center justify-center gap-1 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Sudah Terdaftar
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRegister(schedule)}
                          className="w-full py-2.5 bg-pink-500 text-white rounded-lg text-xs font-semibold hover:bg-pink-600 transition"
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
                <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                  <p className="text-gray-400 text-sm">Belum ada pendaftaran aktif</p>
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className="mt-3 px-4 py-2 bg-pink-500 text-white rounded-lg text-xs font-medium"
                  >
                    Lihat Jadwal
                  </button>
                </div>
              ) : (
                activeRegistrations.map((registration) => (
                  <div key={registration.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{registration.child?.fullName ?? '-'}</p>
                            <p className="text-[10px] text-gray-400">NIK: {registration.child?.nik ?? '-'}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-600">Terdaftar</span>
                        </div>

                        <div className="bg-white rounded-lg p-2 mt-2 border border-gray-100">
                          <div className="flex items-center gap-1 text-[10px] text-gray-600">
                            <MapPin className="w-3 h-3 text-pink-500" />
                            <span className="font-medium">{registration.schedule?.location ?? '-'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatDate(registration.schedule?.scheduleDate ?? registration.schedule?.date)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelRegistration(registration.id)}
                      className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition"
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
                <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                  <History className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                  <p className="text-gray-400 text-sm">Belum ada riwayat</p>
                </div>
              ) : (
                historyRegistrations.map((registration) => (
                  <div key={registration.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${registration.status === 'ATTENDED' ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {registration.status === 'ATTENDED' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{registration.child?.fullName ?? '-'}</p>
                            <p className="text-[10px] text-gray-400">NIK: {registration.child?.nik ?? '-'}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${registration.status === 'ATTENDED' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                            {registration.status === 'ATTENDED' ? 'Hadir' : 'Dibatalkan'}
                          </span>
                        </div>

                        <div className="bg-white rounded-lg p-2 mt-2 border border-gray-100">
                          <div className="flex items-center gap-1 text-[10px] text-gray-600">
                            <MapPin className="w-3 h-3" />
                            {registration.schedule?.location ?? '-'}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatDate(registration.schedule?.scheduleDate ?? registration.schedule?.date)}
                          </div>
                        </div>
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
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full">
            <h3 className="text-base font-bold text-gray-800 mb-1">Daftar Posyandu</h3>
            <p className="text-xs text-gray-500 mb-4">{selectedSchedule?.location} - {formatDate(selectedSchedule?.scheduleDate ?? selectedSchedule?.date)}</p>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Pilih Anak</label>
              {myChildren.length === 0 && (
                <p className="text-xs text-red-500 mb-2">Belum ada data anak. Silakan lengkapi profil keluarga.</p>
              )}
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">-- Pilih Anak --</option>
                {myChildren.map((child) => (
                  <option key={child.id} value={child.id}>{child.fullName}{child.nik ? ` — ${child.nik}` : ''}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setSelectedChild('');
                }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={submitRegistration}
                disabled={!selectedChild}
                className="flex-1 py-2.5 bg-pink-500 text-white rounded-xl text-sm font-medium disabled:bg-gray-200 disabled:text-gray-400"
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
