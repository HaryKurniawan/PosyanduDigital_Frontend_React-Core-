import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

// Data Imunisasi
const IMMUNIZATION_SCHEDULE = {
  '0-1': {
    usia: '0-1 Bulan',
    usiaBulanRange: [0, 1],
    imunisasi: [
      {
        id: 1,
        nama: 'HB-0 (Hepatitis B)',
        dosis: '0',
        umur: '0 hari',
        status: 'completed',
        tanggal: '2024-01-15',
        keterangan: 'Vaksin awal untuk Hepatitis B'
      }
    ]
  },
  '1-2': {
    usia: '1-2 Bulan',
    usiaBulanRange: [1, 2],
    imunisasi: [
      {
        id: 2,
        nama: 'Polio 1',
        dosis: '1',
        umur: '4 minggu',
        status: 'completed',
        tanggal: '2024-02-12',
        keterangan: 'Vaksin polio dosis pertama'
      },
      {
        id: 3,
        nama: 'DPT-HB-Hib 1',
        dosis: '1',
        umur: '4 minggu',
        status: 'completed',
        tanggal: '2024-02-12',
        keterangan: 'Kombinasi vaksin Difteri, Pertusis, Tetanus, Hepatitis B, Hib'
      }
    ]
  },
  '2-3': {
    usia: '2-3 Bulan',
    usiaBulanRange: [2, 3],
    imunisasi: [
      {
        id: 4,
        nama: 'Polio 2',
        dosis: '2',
        umur: '8 minggu',
        status: 'completed',
        tanggal: '2024-03-12',
        keterangan: 'Vaksin polio dosis kedua'
      },
      {
        id: 5,
        nama: 'DPT-HB-Hib 2',
        dosis: '2',
        umur: '8 minggu',
        status: 'completed',
        tanggal: '2024-03-12',
        keterangan: 'Kombinasi vaksin dosis kedua'
      }
    ]
  },
  '3-4': {
    usia: '3-4 Bulan',
    usiaBulanRange: [3, 4],
    imunisasi: [
      {
        id: 6,
        nama: 'Polio 3',
        dosis: '3',
        umur: '12 minggu',
        status: 'completed',
        tanggal: '2024-04-09',
        keterangan: 'Vaksin polio dosis ketiga'
      },
      {
        id: 7,
        nama: 'DPT-HB-Hib 3',
        dosis: '3',
        umur: '12 minggu',
        status: 'completed',
        tanggal: '2024-04-09',
        keterangan: 'Kombinasi vaksin dosis ketiga'
      }
    ]
  },
  '6': {
    usia: '6 Bulan',
    usiaBulanRange: [6, 6],
    imunisasi: [
      {
        id: 8,
        nama: 'Polio 4 (Booster)',
        dosis: '4',
        umur: '6 bulan',
        status: 'pending',
        tanggal: null,
        keterangan: 'Booster polio di usia 6 bulan'
      },
      {
        id: 9,
        nama: 'HB Booster',
        dosis: 'Booster',
        umur: '6 bulan',
        status: 'pending',
        tanggal: null,
        keterangan: 'Booster Hepatitis B'
      }
    ]
  },
  '12': {
    usia: '12 Bulan',
    usiaBulanRange: [12, 12],
    imunisasi: [
      {
        id: 10,
        nama: 'Campak/MR',
        dosis: '1',
        umur: '12 bulan',
        status: 'pending',
        tanggal: null,
        keterangan: 'Vaksin Campak atau Measles-Rubella'
      },
      {
        id: 11,
        nama: 'DPT Booster 1',
        dosis: 'Booster 1',
        umur: '12 bulan',
        status: 'pending',
        tanggal: null,
        keterangan: 'Booster pertama DPT'
      }
    ]
  },
  '18': {
    usia: '18 Bulan',
    usiaBulanRange: [18, 18],
    imunisasi: [
      {
        id: 12,
        nama: 'Polio Booster',
        dosis: 'Booster',
        umur: '18 bulan',
        status: 'pending',
        tanggal: null,
        keterangan: 'Booster polio di usia 18 bulan'
      },
      {
        id: 13,
        nama: 'DPT Booster 2',
        dosis: 'Booster 2',
        umur: '18 bulan',
        status: 'pending',
        tanggal: null,
        keterangan: 'Booster kedua DPT'
      }
    ]
  },
  '24': {
    usia: '24 Bulan',
    usiaBulanRange: [24, 24],
    imunisasi: [
      {
        id: 14,
        nama: 'Tifoid (Typhim Vi)',
        dosis: '1',
        umur: '24 bulan',
        status: 'not-applicable',
        tanggal: null,
        keterangan: 'Vaksin Tifoid (opsional, tergantung kebijakan)'
      }
    ]
  }
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Sudah', icon: '✓' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Jadwal', icon: '◐' },
    'not-applicable': { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Opsional', icon: '-' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1 ${config.bg} ${config.text} text-xs font-semibold px-2.5 py-1 rounded-full`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

// Halaman Daftar Imunisasi (Roadmap)
const ImunisasiListPage = ({ onSelectChild, onSelectVaccine, onBack }) => {
  const [selectedChildId, setSelectedChildId] = useState(1);
  const [children] = useState([
    { id: 1, name: 'Gibran', usia: '8 bulan', usiaBulan: 8 },
    { id: 2, name: 'Wowo', usia: '15 bulan', usiaBulan: 15 }
  ]);

  const currentChild = children.find(c => c.id === selectedChildId);

  // Hitung progress imunisasi
  const allVaccines = Object.values(IMMUNIZATION_SCHEDULE).flatMap(schedule => schedule.imunisasi);
  const completedCount = allVaccines.filter(v => v.status === 'completed').length;
  const totalCount = allVaccines.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Roadmap Imunisasi</h1>
          <p className="text-sm text-green-100">Pantau jadwal vaksinasi anak</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Pilih Anak */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Pilih Anak</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold transition whitespace-nowrap ${
                  selectedChildId === child.id
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        </div>

        {/* Info Anak */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 mb-6">
          <h2 className="font-bold text-gray-800 text-lg mb-1">{currentChild.name}</h2>
          <p className="text-sm text-gray-600 mb-3">Usia: {currentChild.usia}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-bold text-green-600">{completedCount}/{totalCount}</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">{Math.round(progressPercentage)}% tercakup</p>
        </div>

        {/* Timeline Imunisasi */}
        <h3 className="font-bold text-gray-800 mb-4">Jadwal Imunisasi</h3>
        
        <div className="space-y-4">
          {Object.entries(IMMUNIZATION_SCHEDULE).map(([key, schedule]) => {
            const isActive = schedule.imunisasi.some(v => v.status !== 'not-applicable');
            
            return (
              <div key={key} className="border-l-4 border-green-300 pl-4">
                <h4 className="font-semibold text-gray-800 mb-3">{schedule.usia}</h4>
                
                <div className="space-y-2">
                  {schedule.imunisasi.map(vaccine => (
                    <button
                      key={vaccine.id}
                      onClick={() => onSelectVaccine(vaccine, currentChild)}
                      className="w-full bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-green-400 hover:shadow-md transition text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 text-sm mb-1">{vaccine.nama}</h5>
                          <p className="text-xs text-gray-600 mb-2">{vaccine.keterangan}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                              Dosis {vaccine.dosis}
                            </span>
                            <span className="text-xs text-gray-500">{vaccine.umur}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <StatusBadge status={vaccine.status} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-2">Keterangan Status:</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-blue-800">
              <div className="w-3 h-3 bg-green-100 border border-green-400 rounded-full"></div>
              <span>Sudah diberikan</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-800">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-400 rounded-full"></div>
              <span>Jadwal mendatang</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-800">
              <div className="w-3 h-3 bg-gray-100 border border-gray-400 rounded-full"></div>
              <span>Opsional/Tidak berlaku</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Halaman Detail Imunisasi
const ImunisasiDetailPage = ({ vaccine, child, onBack }) => {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Detail Imunisasi</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Data Anak */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Data Anak</p>
          <h2 className="font-bold text-gray-800 text-lg">{child.name}</h2>
          <p className="text-sm text-gray-600">Usia: {child.usia}</p>
        </div>

        {/* Status Card */}
        <div className={`rounded-2xl p-6 mb-6 text-center ${
          vaccine.status === 'completed' 
            ? 'bg-green-50 border-2 border-green-200' 
            : vaccine.status === 'pending'
            ? 'bg-yellow-50 border-2 border-yellow-200'
            : 'bg-gray-50 border-2 border-gray-200'
        }`}>
          <div className="flex justify-center mb-4">
            {vaccine.status === 'completed' && (
              <CheckCircle2 size={48} className="text-green-600" />
            )}
            {vaccine.status === 'pending' && (
              <Clock size={48} className="text-yellow-600" />
            )}
            {vaccine.status === 'not-applicable' && (
              <AlertCircle size={48} className="text-gray-600" />
            )}
          </div>
          <StatusBadge status={vaccine.status} />
        </div>

        {/* Informasi Vaksin */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Informasi Vaksin</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nama Vaksin</p>
              <p className="font-semibold text-gray-800">{vaccine.nama}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Dosis</p>
              <p className="font-semibold text-gray-800">Dosis {vaccine.dosis}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Usia Pemberian</p>
              <p className="font-semibold text-gray-800">{vaccine.umur}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Keterangan</p>
              <p className="font-semibold text-gray-800">{vaccine.keterangan}</p>
            </div>

            {vaccine.tanggal && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Tanggal Pemberian</p>
                <p className="font-semibold text-gray-800">{new Date(vaccine.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            )}
          </div>
        </div>

        {/* Rekomendasi */}
        <div className={`rounded-2xl p-4 mb-6 ${
          vaccine.status === 'completed'
            ? 'bg-green-50 border-l-4 border-green-500'
            : vaccine.status === 'pending'
            ? 'bg-yellow-50 border-l-4 border-yellow-500'
            : 'bg-blue-50 border-l-4 border-blue-500'
        }`}>
          <h4 className={`font-semibold mb-2 ${
            vaccine.status === 'completed'
              ? 'text-green-900'
              : vaccine.status === 'pending'
              ? 'text-yellow-900'
              : 'text-blue-900'
          }`}>
            {vaccine.status === 'completed' && '✓ Vaksin Sudah Diberikan'}
            {vaccine.status === 'pending' && '⏰ Jadwalkan Vaksin'}
            {vaccine.status === 'not-applicable' && 'ℹ Info'}
          </h4>
          <p className={`text-sm ${
            vaccine.status === 'completed'
              ? 'text-green-800'
              : vaccine.status === 'pending'
              ? 'text-yellow-800'
              : 'text-blue-800'
          }`}>
            {vaccine.status === 'completed' && 'Vaksin ini sudah diberikan. Pantau jadwal vaksin berikutnya.'}
            {vaccine.status === 'pending' && 'Vaksin ini sudah jadwalnya. Segera bawa anak ke posyandu untuk pemberian vaksin.'}
            {vaccine.status === 'not-applicable' && 'Vaksin ini bersifat opsional sesuai kebijakan kesehatan setempat.'}
          </p>
        </div>

        {/* Catatan Kesehatan */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-bold text-gray-800 mb-3">Panduan Orang Tua</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex gap-2">
              <span>•</span>
              <span>Bawa kartu imunisasi saat berkunjung ke posyandu</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Pastikan anak dalam kondisi sehat sebelum divaksin</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Perhatikan efek samping ringan dalam 24-48 jam setelah vaksin</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Hubungi petugas kesehatan jika ada keluhan serius</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function ImunisasiPage() {
  const [currentPage, setCurrentPage] = useState('list');
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  const handleSelectVaccine = (vaccine, child) => {
    setSelectedVaccine(vaccine);
    setSelectedChild(child);
    setCurrentPage('detail');
  };

  const handleBack = () => {
    setCurrentPage('list');
    setSelectedVaccine(null);
    setSelectedChild(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {currentPage === 'list' && (
        <ImunisasiListPage 
          onSelectVaccine={handleSelectVaccine}
          onBack={() => window.history.back()}
        />
      )}
      
      {currentPage === 'detail' && selectedVaccine && selectedChild && (
        <ImunisasiDetailPage 
          vaccine={selectedVaccine}
          child={selectedChild}
          onBack={handleBack}
        />
      )}
    </div>
  );
}