import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, Loader, Syringe, Calendar } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import {
  getChildImmunizationRoadmap,
  getChildImmunizations
} from '../services/immunizationService';
import { getFamilyData } from '../services/familyDataService';

// ============================================
// STATUS BADGE COMPONENT
// ============================================
const StatusBadge = ({ status }) => {
  const statusConfig = {
    COMPLETED: {
      bg: 'bg-pink-100',
      text: 'text-pink-700',
      label: 'Sudah',
      icon: '✓'
    },
    PENDING: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Jadwal',
      icon: '◐'
    },
    MISSED: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Terlambat',
      icon: '✕'
    },
    POSTPONED: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Ditunda',
      icon: '⏸'
    },
    completed: {
      bg: 'bg-pink-100',
      text: 'text-pink-700',
      label: 'Sudah',
      icon: '✓'
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Jadwal',
      icon: '◐'
    }
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1 ${config.bg} ${config.text} text-xs font-semibold px-2.5 py-1 rounded-full`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

// ============================================
// PAGE 1 - LIST IMMUNIZATION
// ============================================
const ImunisasiListPage = ({ onSelectVaccine, onBack }) => {
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [children, setChildren] = useState([]);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const extractChildrenFromFamilyData = (familyData) => {
    if (!familyData) return [];
    if (Array.isArray(familyData)) return familyData;
    if (Array.isArray(familyData.childrenData)) return familyData.childrenData;
    if (Array.isArray(familyData.children)) return familyData.children;
    if (Array.isArray(familyData.data?.childrenData)) return familyData.data.childrenData;
    if (Array.isArray(familyData.data?.children)) return familyData.data.children;

    for (const key of Object.keys(familyData)) {
      if (
        Array.isArray(familyData[key]) &&
        familyData[key].length > 0 &&
        typeof familyData[key][0] === 'object' &&
        (familyData[key][0].fullName || familyData[key][0].name)
      ) {
        return familyData[key];
      }
    }
    return [];
  };

  useEffect(() => {
    const loadChildren = async () => {
      try {
        setLoading(true);
        const data = await getFamilyData();
        const extractedChildren = extractChildrenFromFamilyData(data);

        if (extractedChildren && extractedChildren.length > 0) {
          setChildren(extractedChildren);
          setSelectedChildId(extractedChildren[0].id);
        } else {
          setError('Belum ada data anak. Lengkapi profil keluarga terlebih dahulu.');
        }
      } catch (err) {
        setError('Gagal memuat data anak');
        console.error('Error loading children:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
  }, []);

  useEffect(() => {
    const loadRoadmap = async () => {
      if (!selectedChildId) return;

      try {
        setLoading(true);
        const data = await getChildImmunizationRoadmap(selectedChildId);
        setRoadmapData(data);
      } catch (err) {
        setError('Gagal memuat roadmap imunisasi');
        console.error('Error loading roadmap:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, [selectedChildId]);

  const currentChild = children.find((c) => c.id === selectedChildId);
  const progressPercentage = roadmapData?.progress?.percentage || 0;

  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader title="Roadmap Imunisasi" onBack={onBack} />

      <div className="px-4 py-4">
        {loading && !roadmapData ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-pink-500" size={40} />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="mx-auto text-red-500 mb-3" size={48} />
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        ) : (
          <>
            {children.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Pilih Anak</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold transition whitespace-nowrap ${selectedChildId === child.id
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                      {child.fullName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentChild && roadmapData && (
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-4 mb-6">
                <h2 className="font-bold text-gray-800 text-lg mb-1">
                  {currentChild.fullName}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  NIK: {currentChild.nik || '-'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-pink-500">
                    {roadmapData.progress.completed}/{roadmapData.progress.total}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {Math.round(progressPercentage)}% tercakup
                </p>
              </div>
            )}

            {roadmapData && roadmapData.roadmap && (
              <>
                <h3 className="font-bold text-gray-800 mb-4">Jadwal Imunisasi</h3>

                <div className="space-y-4">
                  {roadmapData.roadmap.map((schedule, scheduleIdx) => (
                    <div key={scheduleIdx} className="border-l-4 border-pink-300 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {schedule.ageRange}
                      </h4>

                      <div className="space-y-2">
                        {schedule.vaccines.map((vaccine) => (
                          <button
                            key={vaccine.id}
                            onClick={() => onSelectVaccine(vaccine, currentChild)}
                            className="w-full bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-pink-400 hover:shadow-md transition text-left"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-800 text-sm mb-1">
                                  {vaccine.name}
                                </h5>
                                <p className="text-xs text-gray-600 mb-2">
                                  {vaccine.description}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5rounded">
                                    Dosis {vaccine.dose}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {vaccine.recommendedAge}
                                  </span>
                                </div>
                                {/* ✅ NEW - Show vaccination date if completed */}
                                {vaccine.status === 'completed' && vaccine.vaccinationDate && (
                                  <div className="flex items-center gap-1 mt-2 text-xs text-pink-600">
                                    <Syringe size={14} />
                                    <span>
                                      Diberikan: {new Date(vaccine.vaccinationDate).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-shrink-0">
                                <StatusBadge status={vaccine.status} />
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-2">
                Keterangan Status:
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-blue-800">
                  <div className="w-3 h-3 bg-pink-100 border border-pink-400 rounded-full"></div>
                  <span>Sudah diberikan</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-800">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-400 rounded-full"></div>
                  <span>Jadwal mendatang</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-800">
                  <div className="w-3 h-3 bg-red-100 border border-red-400 rounded-full"></div>
                  <span>Terlambat</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// PAGE 2 - DETAIL IMMUNIZATION (UPDATED)
// ============================================
const ImunisasiDetailPage = ({ vaccine, child, onBack }) => {
  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHeader title="Detail Imunisasi" onBack={onBack} />

      <div className="px-4 py-4">
        {/* Child Data */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Data Anak</p>
          <h2 className="font-bold text-gray-800 text-lg">{child.fullName}</h2>
          <p className="text-sm text-gray-600">NIK: {child.nik || '-'}</p>
        </div>

        {/* Status Card */}
        <div
          className={`rounded-2xl p-6 mb-6 text-center ${vaccine.status === 'completed'
            ? 'bg-pink-50 border-2 border-pink-200'
            : vaccine.status === 'pending'
              ? 'bg-yellow-50 border-2 border-yellow-200'
              : 'bg-gray-50 border-2 border-gray-200'
            }`}
        >
          <div className="flex justify-center mb-4">
            {vaccine.status === 'completed' && (
              <CheckCircle2 size={48} className="text-pink-500" />
            )}
            {vaccine.status === 'pending' && (
              <Clock size={48} className="text-yellow-600" />
            )}
            {vaccine.status !== 'completed' && vaccine.status !== 'pending' && (
              <AlertCircle size={48} className="text-gray-600" />
            )}
          </div>
          <StatusBadge status={vaccine.status} />
        </div>

        {/* Vaccine Information */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Informasi Vaksin</h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nama Vaksin</p>
              <p className="font-semibold text-gray-800">{vaccine.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Dosis</p>
              <p className="font-semibold text-gray-800">Dosis {vaccine.dose}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Usia Pemberian Direkomendasikan</p>
              <p className="font-semibold text-gray-800">{vaccine.recommendedAge}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Keterangan</p>
              <p className="font-semibold text-gray-800">{vaccine.description}</p>
            </div>

            {/* ✅ NEW - Enhanced vaccination date display */}
            {vaccine.vaccinationDate && (
              <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-pink-500" size={20} />
                  <p className="font-semibold text-pink-800">Tanggal Pemberian</p>
                </div>
                <p className="text-lg font-bold text-pink-700">
                  {new Date(vaccine.vaccinationDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {vaccine.notes && (
                  <div className="mt-3 pt-3 border-t border-pink-200">
                    <p className="text-xs text-gray-600 mb-1">Catatan:</p>
                    <p className="text-sm text-gray-800">{vaccine.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recommendation */}
        <div
          className={`rounded-2xl p-4 mb-6 ${vaccine.status === 'completed'
            ? 'bg-pink-50 border-l-4 border-pink-500'
            : vaccine.status === 'pending'
              ? 'bg-yellow-50 border-l-4 border-yellow-500'
              : 'bg-blue-50 border-l-4 border-blue-500'
            }`}
        >
          <h4
            className={`font-semibold mb-2 ${vaccine.status === 'completed'
              ? 'text-pink-800'
              : vaccine.status === 'pending'
                ? 'text-yellow-900'
                : 'text-blue-900'
              }`}
          >
            {vaccine.status === 'completed' && '✓ Vaksin Sudah Diberikan'}
            {vaccine.status === 'pending' && '⏰ Jadwalkan Vaksin'}
            {vaccine.status !== 'completed' && vaccine.status !== 'pending' && 'ℹ Info'}
          </h4>
          <p
            className={`text-sm ${vaccine.status === 'completed'
              ? 'text-pink-700'
              : vaccine.status === 'pending'
                ? 'text-yellow-800'
                : 'text-blue-800'
              }`}
          >
            {vaccine.status === 'completed' &&
              'Vaksin ini sudah diberikan saat pemeriksaan di Posyandu. Pantau jadwal vaksin berikutnya.'}
            {vaccine.status === 'pending' &&
              'Vaksin ini sudah jadwalnya. Segera daftarkan anak untuk pemeriksaan Posyandu berikutnya.'}
            {vaccine.status !== 'completed' && vaccine.status !== 'pending' &&
              'Vaksin ini memerlukan perhatian khusus. Hubungi petugas kesehatan untuk informasi lebih lanjut.'}
          </p>
        </div>

        {/* Parent Guidance */}
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
            {vaccine.status === 'completed' && (
              <li className="flex gap-2 mt-4 text-pink-600 font-semibold">
                <span>✓</span>
                <span>Vaksin ini sudah tercatat dalam riwayat kesehatan anak</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
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
