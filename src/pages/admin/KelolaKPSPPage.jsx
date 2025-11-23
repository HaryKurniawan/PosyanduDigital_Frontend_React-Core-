import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  Eye, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
  ClipboardList
} from 'lucide-react';
import {
  getAllScreenings,
  getKPSPStatistics,
  getKPSPCategories,
//   createKPSPQuestion,
//   updateKPSPQuestion,
//   deleteKPSPQuestion
} from '../../services/kpspService';

const KelolaKPSPPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('screenings'); // screenings, questions, statistics
  const [screenings, setScreenings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterResult, setFilterResult] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [screeningsData, categoriesData, statsData] = await Promise.all([
        getAllScreenings(),
        getKPSPCategories(),
        getKPSPStatistics()
      ]);
      
      setScreenings(screeningsData);
      setCategories(categoriesData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Error fetching KPSP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'SESUAI':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'MERAGUKAN':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PENYIMPANGAN':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'SESUAI':
        return <CheckCircle className="w-5 h-5" />;
      case 'MERAGUKAN':
        return <AlertCircle className="w-5 h-5" />;
      case 'PENYIMPANGAN':
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const filteredScreenings = screenings.filter(screening => {
    const matchesSearch = screening.child.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         screening.child.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterResult === '' || screening.result === filterResult;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data KPSP...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Kelola KPSP</h1>
              <p className="text-purple-100 mt-1">Manajemen Screening & Kuesioner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('screenings')}
              className={`py-4 px-2 border-b-2 font-semibold transition ${
                activeTab === 'screenings'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Hasil Screening
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`py-4 px-2 border-b-2 font-semibold transition ${
                activeTab === 'questions'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Kelola Kuesioner
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-4 px-2 border-b-2 font-semibold transition ${
                activeTab === 'statistics'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Statistik
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab: Hasil Screening */}
        {activeTab === 'screenings' && (
          <div>
            {/* Filter & Search */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari nama anak atau orang tua..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={filterResult}
                    onChange={(e) => setFilterResult(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Semua Hasil</option>
                    <option value="SESUAI">Sesuai</option>
                    <option value="MERAGUKAN">Meragukan</option>
                    <option value="PENYIMPANGAN">Penyimpangan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Screening List */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Anak</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Orang Tua</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kategori</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Usia</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Skor</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hasil</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredScreenings.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                          Belum ada data screening
                        </td>
                      </tr>
                    ) : (
                      filteredScreenings.map((screening) => (
                        <tr key={screening.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(screening.screeningDate).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-800">{screening.child.fullName}</div>
                            <div className="text-xs text-gray-500">{screening.child.nik}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-700">{screening.child.user.name}</div>
                            <div className="text-xs text-gray-500">{screening.child.user.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                              {screening.category.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {screening.ageAtScreening} bulan
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-semibold text-gray-800">
                              {screening.totalYes}/{screening.totalYes + screening.totalNo}
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.round((screening.totalYes / (screening.totalYes + screening.totalNo)) * 100)}%
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold border ${getResultColor(screening.result)}`}>
                              {getResultIcon(screening.result)}
                              {screening.result}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => navigate(`/admin/kpsp/screening/${screening.id}`)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Kelola Kuesioner */}
        {activeTab === 'questions' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Kelola Kuesioner KPSP</h2>
              <p className="text-gray-600">Kelola pertanyaan untuk setiap kategori usia</p>
            </div>

            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Usia {category.minAgeMonths}-{category.maxAgeMonths} bulan • {category.questions.length} pertanyaan
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                    <Plus className="w-4 h-4" />
                    Tambah Pertanyaan
                  </button>
                </div>

                <div className="space-y-3">
                  {category.questions.map((question, index) => (
                    <div key={question.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium mb-1">{question.questionText}</p>
                        <div className="flex gap-3 text-xs text-gray-600">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {question.developmentArea}
                          </span>
                          {question.instruction && (
                            <span className="italic">Instruksi: {question.instruction}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Statistik */}
        {activeTab === 'statistics' && statistics && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Statistik KPSP</h2>
              <p className="text-gray-600">Ringkasan data screening perkembangan anak</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm font-medium">Total Screening</p>
                  <ClipboardList className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{statistics.totalScreenings}</p>
              </div>

              {statistics.resultStats.map((stat) => {
                const colors = {
                  SESUAI: { bg: 'bg-green-100', text: 'text-green-600', icon: CheckCircle },
                  MERAGUKAN: { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: AlertCircle },
                  PENYIMPANGAN: { bg: 'bg-red-100', text: 'text-red-600', icon: XCircle }
                };
                const color = colors[stat.result] || colors.SESUAI;
                const Icon = color.icon;

                return (
                  <div key={stat.result} className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm font-medium">{stat.result}</p>
                      <Icon className={`w-8 h-8 ${color.text}`} />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stat._count.result}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((stat._count.result / statistics.totalScreenings) * 100)}% dari total
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Distribusi per Kategori Usia</h3>
              <div className="space-y-4">
                {statistics.categoryStats.map((stat) => {
                  const percentage = (stat._count.categoryId / statistics.totalScreenings) * 100;
                  return (
                    <div key={stat.categoryId}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {stat.category?.name || 'Unknown'}
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          {stat._count.categoryId} ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KelolaKPSPPage;