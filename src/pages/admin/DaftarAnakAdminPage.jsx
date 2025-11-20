import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, User, Calendar, MapPin, Baby } from 'lucide-react';
import { getAllChildren } from '../../services/adminService';

const DaftarAnakAdminPage = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const data = await getAllChildren();
      setChildren(data);
    } catch (err) {
      console.error('Error fetching children:', err);
      alert('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const filteredChildren = children.filter(child =>
    child.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.nik.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/dashboard-admin')}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Daftar Anak</h1>
            <p className="text-sm text-white/80 mt-1">Data semua anak yang terdaftar</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/80">Total Anak Terdaftar</p>
              <p className="text-3xl font-bold mt-1">{children.length}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Baby className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau NIK anak..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Children Cards */}
        {filteredChildren.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <Baby className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Tidak ada data yang sesuai' : 'Belum ada data anak'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChildren.map((child) => (
              <div
                key={child.id}
                onClick={() => navigate(`/detail-data-anak/${child.id}`)}
                className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Baby className="w-7 h-7 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg mb-1">
                          {child.fullName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Anak ke-{child.childOrder}
                        </p>
                      </div>
                      <div className="bg-purple-100 px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold text-purple-700">
                          {calculateAge(child.birthDate)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-mono text-xs">{child.nik}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(child.birthDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{child.birthPlace}</span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>🩸 {child.bloodType}</span>
                        {child.user?.name && (
                          <span>👨‍👩‍👧 {child.user.name}</span>
                        )}
                      </div>
                      <div className="text-purple-600 font-semibold text-sm flex items-center gap-1">
                        <span>Lihat Detail</span>
                        <ChevronLeft className="w-4 h-4 rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Result Count */}
        {filteredChildren.length > 0 && (
          <div className="text-center text-sm text-gray-500 mt-4">
            Menampilkan {filteredChildren.length} dari {children.length} anak
          </div>
        )}
      </div>
    </div>
  );
};

export default DaftarAnakAdminPage;