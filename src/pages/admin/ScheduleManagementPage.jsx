import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, ChevronLeft, MapPin, Users, Clock } from 'lucide-react';
import { getAllSchedules, createSchedule } from '../../services/posyanduService';

const ScheduleManagementPage = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    scheduleDate: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await getAllSchedules();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      alert('Gagal memuat jadwal');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSchedule(formData);
      alert('Jadwal berhasil dibuat!');
      setShowModal(false);
      setFormData({ scheduleDate: '', location: '', description: '' });
      fetchSchedules();
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Gagal membuat jadwal');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (date) => {
    const scheduleDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    scheduleDate.setHours(0, 0, 0, 0);

    if (scheduleDate < today) return 'bg-gray-100 text-gray-600';
    if (scheduleDate.getTime() === today.getTime()) return 'bg-green-100 text-green-600';
    return 'bg-blue-100 text-blue-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-purple-600 text-lg">Memuat jadwal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard-admin')}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">Kelola Jadwal Posyandu</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="p-3 bg-white text-purple-600 rounded-full hover:bg-white/90 transition shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {schedules.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Belum ada jadwal</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
            >
              Buat Jadwal Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                onClick={() => navigate(`/admin/jadwal/${schedule.id}`)}
                className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${getStatusColor(schedule.scheduleDate)}`}>
                      {new Date(schedule.scheduleDate) < new Date() ? 'Selesai' : 
                       new Date(schedule.scheduleDate).toDateString() === new Date().toDateString() ? 'Hari Ini' : 'Mendatang'}
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                      {formatDate(schedule.scheduleDate)}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{schedule.location}</span>
                  </div>
                  
                  {schedule.description && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <Clock className="w-4 h-4 mt-0.5" />
                      <span className="text-sm">{schedule.description}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-purple-600 mt-3">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {schedule._count?.examinations || 0} anak diperiksa
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah Jadwal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Buat Jadwal Baru</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Posyandu
                </label>
                <input
                  type="date"
                  required
                  value={formData.scheduleDate}
                  onChange={(e) => setFormData({...formData, scheduleDate: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Posyandu Mawar"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Keterangan (Opsional)
                </label>
                <textarea
                  placeholder="Contoh: Mulai pukul 08.00 WIB"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagementPage;