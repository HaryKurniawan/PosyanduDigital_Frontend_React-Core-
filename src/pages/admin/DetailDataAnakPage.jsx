import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFamilyDataByChildId } from '../../services/adminService';

const DetailDataAnakPage = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('anak');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [childId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getFamilyDataByChildId(childId);
      setData(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard-admin')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'anak', label: 'Data Anak', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'ibu', label: 'Data Ibu', icon:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'keluarga', label: 'Data Keluarga', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/dashboard-admin')}
            className="flex items-center space-x-2 text-purple-100 hover:text-white mb-4 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Kembali</span>
          </button>
          <h1 className="text-3xl font-bold">Detail Data Anak</h1>
          <p className="text-purple-100 mt-1">{data.childData.fullName}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-b-4 border-purple-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* Tab Data Anak */}
            {activeTab === 'anak' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Informasi Anak</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Nama Lengkap</p>
                    <p className="text-lg font-bold text-gray-800">{data.childData.fullName}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">NIK</p>
                    <p className="text-lg font-bold text-gray-800">{data.childData.nik}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">No. Akta Kelahiran</p>
                    <p className="text-lg font-bold text-gray-800">{data.childData.birthCertificate}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Anak Ke</p>
                    <p className="text-lg font-bold text-gray-800">{data.childData.childOrder}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Golongan Darah</p>
                    <p className="text-lg font-bold text-gray-800">{data.childData.bloodType}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-lg border border-purple-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Tempat Lahir</p>
                    <p className="text-lg font-bold text-gray-800">{data.childData.birthPlace}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-lg border border-purple-100 md:col-span-2">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Tanggal Lahir</p>
                    <p className="text-lg font-bold text-gray-800">{formatDate(data.childData.birthDate)}</p>
                  </div>
                </div>

                {/* Siblings Section */}
                {data.siblings && data.siblings.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Saudara Kandung</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.siblings.map((sibling) => (
                        <div key={sibling.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 p-2 rounded-full">
                              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-gray-800">{sibling.fullName}</p>
                              <p className="text-sm text-gray-600">Anak ke-{sibling.childOrder}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Data Ibu */}
            {activeTab === 'ibu' && data.motherData && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Informasi Ibu</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-lg border border-pink-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Nama Lengkap</p>
                    <p className="text-lg font-bold text-gray-800">{data.motherData.fullName}</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-lg border border-pink-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">No. Telepon</p>
                    <p className="text-lg font-bold text-gray-800">{data.motherData.phoneNumber}</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-lg border border-pink-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">NIK</p>
                    <p className="text-lg font-bold text-gray-800">{data.motherData.nik}</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-lg border border-pink-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Tempat Lahir</p>
                    <p className="text-lg font-bold text-gray-800">{data.motherData.birthPlace}</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-lg border border-pink-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Tanggal Lahir</p>
                    <p className="text-lg font-bold text-gray-800">{formatDate(data.motherData.birthDate)}</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-lg border border-pink-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Pendidikan</p>
                    <p className="text-lg font-bold text-gray-800">{data.motherData.education}</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-lg border border-pink-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Pekerjaan</p>
                    <p className="text-lg font-bold text-gray-800">{data.motherData.occupation}</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-lg border border-pink-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Golongan Darah</p>
                    <p className="text-lg font-bold text-gray-800">{data.motherData.bloodType}</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-lg border border-pink-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">JKN</p>
                    <p className="text-lg font-bold text-gray-800">{data.motherData.jkn}</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-lg border border-pink-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Fasilitas TK1</p>
                    <p className="text-lg font-bold text-gray-800">{data.motherData.facilityTK1}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Data Keluarga */}
            {activeTab === 'keluarga' && data.spouseData && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                    <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Informasi Suami/Keluarga</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Nama Lengkap</p>
                    <p className="text-lg font-bold text-gray-800">{data.spouseData.fullName}</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">NIK</p>
                    <p className="text-lg font-bold text-gray-800">{data.spouseData.nik}</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Pekerjaan</p>
                    <p className="text-lg font-bold text-gray-800">{data.spouseData.occupation}</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-600 mb-2 font-medium">No. Telepon</p>
                    <p className="text-lg font-bold text-gray-800">{data.spouseData.phoneNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State for Missing Data */}
            {activeTab === 'ibu' && !data.motherData && (
              <div className="text-center py-12 animate-fadeIn">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 text-lg">Data ibu belum tersedia</p>
              </div>
            )}

            {activeTab === 'keluarga' && !data.spouseData && (
              <div className="text-center py-12 animate-fadeIn">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 text-lg">Data keluarga belum tersedia</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default DetailDataAnakPage;