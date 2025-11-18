import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Calendar, MapPin, Briefcase, Phone, CreditCard, Heart, User } from 'lucide-react';
import { getFamilyData } from '../services/familyDataService';

const DataKeluargaPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ibu');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [familyData, setFamilyData] = useState(null);

  useEffect(() => {
    fetchFamilyData();
  }, []);

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFamilyData();
      setFamilyData(data);
    } catch (err) {
      console.error('Error fetching family data:', err);
      setError('Gagal memuat data keluarga');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Memuat data...</div>
      </div>
    );
  }

  const motherData = familyData?.motherData;
  const spouseData = familyData?.spouseData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button onClick={() => navigate('/profile')} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-3">Data Keluarga</h1>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('ibu')}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                activeTab === 'ibu'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Data Ibu
            </button>
            <button
              onClick={() => setActiveTab('suami')}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                activeTab === 'suami'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Data Suami
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800">{error}</p>
              <button 
                onClick={fetchFamilyData}
                className="text-xs text-red-600 hover:text-red-700 underline mt-1"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {/* Tab Content - Data Ibu */}
        {activeTab === 'ibu' && (
          <>
            {!motherData ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Data</h3>
                <p className="text-gray-600 mb-4">Data ibu belum dilengkapi</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Personal Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Informasi Pribadi</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Nama Lengkap</p>
                      <p className="text-base font-medium text-gray-800">{motherData.fullName}</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Nomor Telepon</p>
                        <p className="text-base font-medium text-gray-800">{motherData.phoneNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CreditCard className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">NIK</p>
                        <p className="text-base font-medium text-gray-800">{motherData.nik}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Birth Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Informasi Kelahiran</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Tempat Lahir</p>
                        <p className="text-base font-medium text-gray-800">{motherData.birthPlace}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Tanggal Lahir</p>
                        <p className="text-base font-medium text-gray-800">{formatDate(motherData.birthDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Informasi Pendidikan & Pekerjaan</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Pendidikan</p>
                      <p className="text-base font-medium text-gray-800">{motherData.education}</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <Briefcase className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Pekerjaan</p>
                        <p className="text-base font-medium text-gray-800">{motherData.occupation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Informasi Kesehatan</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Golongan Darah</p>
                      <p className="text-base font-medium text-gray-800">{motherData.bloodType}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Nomor JKN/KIS</p>
                      <p className="text-base font-medium text-gray-800">{motherData.jkn}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Faskes Tingkat 1</p>
                      <p className="text-base font-medium text-gray-800">{motherData.facilityTK1}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab Content - Data Suami */}
        {activeTab === 'suami' && (
          <>
            {!spouseData ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Data</h3>
                <p className="text-gray-600 mb-4">Data suami/ayah belum dilengkapi</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Personal Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Informasi Pribadi</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Nama Lengkap</p>
                      <p className="text-base font-medium text-gray-800">{spouseData.fullName}</p>
                    </div>

                    <div className="flex items-start gap-2">
                      <CreditCard className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">NIK</p>
                        <p className="text-base font-medium text-gray-800">{spouseData.nik}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Nomor Telepon</p>
                        <p className="text-base font-medium text-gray-800">{spouseData.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Informasi Pekerjaan</h3>
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Pekerjaan</p>
                      <p className="text-base font-medium text-gray-800">{spouseData.occupation}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DataKeluargaPage;