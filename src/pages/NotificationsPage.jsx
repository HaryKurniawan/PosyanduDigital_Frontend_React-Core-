import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Check, Trash2, Clock } from 'lucide-react';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Jadwal Posyandu Besok',
      message: 'Jangan lupa datang ke Posyandu besok pukul 09.00 WIB',
      time: '2 jam yang lalu',
      isRead: false,
      type: 'reminder'
    },
    {
      id: 2,
      title: 'Imunisasi Campak',
      message: 'Saatnya imunisasi campak untuk anak Anda',
      time: '1 hari yang lalu',
      isRead: false,
      type: 'health'
    },
    {
      id: 3,
      title: 'Update Data Berhasil',
      message: 'Data keluarga Anda telah berhasil diperbarui',
      time: '2 hari yang lalu',
      isRead: true,
      type: 'info'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getTypeColor = (type) => {
    const colors = {
      reminder: 'bg-blue-100 text-blue-600',
      health: 'bg-green-100 text-green-600',
      info: 'bg-purple-100 text-purple-600'
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Notifikasi</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500">{unreadCount} belum dibaca</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Tandai Semua
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-white rounded-xl shadow-sm p-4 transition-all ${
                  !notif.isRead ? 'border-l-4 border-purple-500' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getTypeColor(notif.type)} flex items-center justify-center`}>
                    <Bell className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{notif.title}</h3>
                      {!notif.isRead && (
                        <span className="ml-2 w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notif.time}
                      </span>
                      <div className="flex gap-2">
                        {!notif.isRead && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-purple-600 hover:text-purple-700 p-1"
                            title="Tandai dibaca"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada notifikasi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
