import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Calendar, MapPin, CreditCard, Baby, FileText, Droplet } from 'lucide-react';
import { getFamilyData } from '../services/familyDataService';

const DataAnakPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [childrenData, setChildrenData] = useState([]);

  useEffect(() => {
    fetchChildrenData();
  }, []);

  const fetchChildrenData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFamilyData();
      setChildrenData(data.childrenData || []);
    } catch (err) {
      console.error('Error fetching children data:', err);
      setError('Gagal memuat data anak');
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

  const calculateAge = (birthDate) => {
    if (!birthDate) return '-';
    const today = new Date();
    const birth = new Date(birthDate);
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years === 0) {
      return `${months} bulan`;
    } else if (months < 0) {
      return `${years - 1} tahun ${12 + months} bulan`;
    } else {
      return `${years} tahun ${months} bulan`;
    }
  };

  const getChildOrderText = (order) => {
    const orderText = ['Pertama', 'Kedua', 'Ketiga', 'Keempat', 'Kelima', 'Keenam', 'Ketujuh', 'Kedelapan', 'Kesembilan', 'Kesepuluh'];
    return orderText[order - 1] || `Anak ke-${order}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate('/profile')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 ml-3">Data Anak</h1>
          </div>
          {childrenData.length > 0 && (
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {childrenData.length} Anak
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800">{error}</p>
              <button 
                onClick={fetchChildrenData}
                className="text-xs text-red-600 hover:text-red-700 underline mt-1"
              >
                Coba lagi
              </button>
            </div>
          </div>
        )}

        {childrenData.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Baby className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Data Anak</h3>
            <p className="text-gray-600 mb-4">Data anak belum ditambahkan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {childrenData.map((child, index) => (
              <div key={child.id || index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Child Header */}
                <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Baby className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{child.fullName}</h3>
                      <p className="text-sm text-green-50">{getChildOrderText(child.childOrder)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-green-50">Usia</p>
                      <p className="text-sm font-semibold text-white">{calculateAge(child.birthDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Child Details */}
                <div className="p-6 space-y-4">
                  {/* Identitas */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Identitas</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CreditCard className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-0.5">NIK</p>
                          <p className="text-sm font-medium text-gray-800">{child.nik}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-0.5">No. Akta Kelahiran</p>
                          <p className="text-sm font-medium text-gray-800">{child.birthCertificate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kelahiran */}
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Kelahiran</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-0.5">Tempat Lahir</p>
                          <p className="text-sm font-medium text-gray-800">{child.birthPlace}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-0.5">Tanggal Lahir</p>
                          <p className="text-sm font-medium text-gray-800">{formatDate(child.birthDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kesehatan */}
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Kesehatan</h4>
                    <div className="flex items-start gap-2">
                      <Droplet className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">Golongan Darah</p>
                        <p className="text-sm font-medium text-gray-800">{child.bloodType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataAnakPage;