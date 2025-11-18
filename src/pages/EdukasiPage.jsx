import React, { useState } from 'react';
import MobileNavbar from '../components/MobileNavbar';
import { 
  BookOpen, 
  Baby, 
  Heart, 
  Apple, 
  Activity,
  ChevronRight,
  Search,
  Video,
  FileText
} from 'lucide-react';

const EdukasiPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Semua', icon: BookOpen, color: 'purple' },
    { id: 'bayi', name: 'Bayi & Balita', icon: Baby, color: 'blue' },
    { id: 'kesehatan', name: 'Kesehatan Ibu', icon: Heart, color: 'pink' },
    { id: 'gizi', name: 'Gizi & Nutrisi', icon: Apple, color: 'green' },
    { id: 'tumbuh-kembang', name: 'Tumbuh Kembang', icon: Activity, color: 'orange' }
  ];

  const articles = [
    {
      id: 1,
      title: 'Tips ASI Eksklusif 6 Bulan',
      category: 'bayi',
      type: 'article',
      duration: '5 min',
      image: '👶',
      description: 'Panduan lengkap memberikan ASI eksklusif untuk bayi 0-6 bulan',
      date: '2 hari yang lalu'
    },
    {
      id: 2,
      title: 'Nutrisi Penting untuk Ibu Hamil',
      category: 'kesehatan',
      type: 'video',
      duration: '12 min',
      image: '🤰',
      description: 'Makanan dan vitamin yang dibutuhkan selama kehamilan',
      date: '1 minggu yang lalu'
    },
    {
      id: 3,
      title: 'Menu MPASI 6-8 Bulan',
      category: 'gizi',
      type: 'article',
      duration: '8 min',
      image: '🥗',
      description: 'Resep dan panduan MPASI untuk bayi 6-8 bulan',
      date: '3 hari yang lalu'
    },
    {
      id: 4,
      title: 'Stimulasi Bayi 0-6 Bulan',
      category: 'tumbuh-kembang',
      type: 'video',
      duration: '15 min',
      image: '🎯',
      description: 'Cara merangsang perkembangan motorik dan sensorik bayi',
      date: '5 hari yang lalu'
    },
    {
      id: 5,
      title: 'Imunisasi Wajib untuk Bayi',
      category: 'kesehatan',
      type: 'article',
      duration: '6 min',
      image: '💉',
      description: 'Jadwal dan jenis imunisasi yang wajib diberikan',
      date: '1 minggu yang lalu'
    },
    {
      id: 6,
      title: 'Mengatasi Anak Susah Makan',
      category: 'gizi',
      type: 'video',
      duration: '10 min',
      image: '🍽️',
      description: 'Tips dan trik mengatasi anak yang susah makan',
      date: '4 hari yang lalu'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getCategoryColor = (color) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-600',
      blue: 'bg-blue-100 text-blue-600',
      pink: 'bg-pink-100 text-pink-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavbar />
      
      {/* Main Content */}
      <div className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Edukasi Kesehatan
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Artikel dan video seputar kesehatan ibu dan anak
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari artikel atau video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? `${getCategoryColor(cat.color)} shadow-sm`
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium whitespace-nowrap">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="space-y-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
              >
                <div className="flex gap-4">
                  {/* Image/Emoji */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-4xl">
                      {article.image}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        article.type === 'video' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {article.type === 'video' ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        {article.type === 'video' ? 'Video' : 'Artikel'}
                      </span>
                      <span className="text-xs text-gray-500">{article.duration}</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {article.description}
                    </p>
                    
                    <p className="text-xs text-gray-500">{article.date}</p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 flex items-center">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada artikel ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EdukasiPage;