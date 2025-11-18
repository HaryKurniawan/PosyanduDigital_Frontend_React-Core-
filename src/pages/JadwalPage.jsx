// pages/JadwalPage.jsx
import React from 'react';
import MobileNavbar from '../components/MobileNavbar';
import { Calendar, Heart, ChevronRight } from 'lucide-react';

const JadwalPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      <MobileNavbar />
      
      <div className="pt-20 pb-24 px-4">
        {/* Jadwal Posyandu */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-bold text-gray-800 mb-4">Jadwal Posyandu</h3>
          <div className="space-y-3">
            {[
              { date: '20 Nov 2025', time: '08.00 - 11.00', location: 'Posyandu Melati' },
              { date: '27 Nov 2025', time: '08.00 - 11.00', location: 'Posyandu Melati' },
              { date: '4 Des 2025', time: '08.00 - 11.00', location: 'Posyandu Melati' }
            ].map((jadwal, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{jadwal.location}</p>
                    <p className="text-xs text-gray-600">{jadwal.date}</p>
                    <p className="text-xs text-gray-500">{jadwal.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Jadwal Imunisasi */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Jadwal Imunisasi</h3>
          <div className="space-y-3">
            {[
              { vaccine: 'Campak', child: 'Anak 1', date: '25 Nov 2025' },
              { vaccine: 'DPT', child: 'Anak 2', date: '2 Des 2025' }
            ].map((imun, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{imun.vaccine}</p>
                    <p className="text-xs text-gray-600">{imun.child}</p>
                    <p className="text-xs text-gray-500">{imun.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JadwalPage;