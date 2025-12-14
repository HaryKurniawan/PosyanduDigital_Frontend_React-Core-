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
    { id: 'all', name: 'Semua', icon: BookOpen, color: 'pink' },
    { id: 'bayi', name: 'Bayi', icon: Baby, color: 'blue' },
    { id: 'kesehatan', name: 'Ibu', icon: Heart, color: 'pink' },
    { id: 'gizi', name: 'Gizi', icon: Apple, color: 'green' },
    { id: 'tumbuh-kembang', name: 'Tumbang', icon: Activity, color: 'orange' }
  ];

  const articles = [
    { id: 1, title: 'Tips ASI Eksklusif 6 Bulan', category: 'bayi', type: 'article', duration: '5 min', image: '👶', description: 'Panduan lengkap memberikan ASI eksklusif', date: '2 hari yang lalu' },
    { id: 2, title: 'Nutrisi Penting untuk Ibu Hamil', category: 'kesehatan', type: 'video', duration: '12 min', image: '🤰', description: 'Makanan dan vitamin selama kehamilan', date: '1 minggu yang lalu' },
    { id: 3, title: 'Menu MPASI 6-8 Bulan', category: 'gizi', type: 'article', duration: '8 min', image: '🥗', description: 'Resep dan panduan MPASI untuk bayi', date: '3 hari yang lalu' },
    { id: 4, title: 'Stimulasi Bayi 0-6 Bulan', category: 'tumbuh-kembang', type: 'video', duration: '15 min', image: '🎯', description: 'Cara merangsang perkembangan bayi', date: '5 hari yang lalu' },
    { id: 5, title: 'Imunisasi Wajib untuk Bayi', category: 'kesehatan', type: 'article', duration: '6 min', image: '💉', description: 'Jadwal imunisasi yang wajib diberikan', date: '1 minggu yang lalu' },
    { id: 6, title: 'Mengatasi Anak Susah Makan', category: 'gizi', type: 'video', duration: '10 min', image: '🍽️', description: 'Tips mengatasi anak susah makan', date: '4 hari yang lalu' }
  ];

  const filteredArticles = articles.filter(article => {
    const matchCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <MobileNavbar />

      <div className="pt-16 pb-20 px-4">

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari artikel atau video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-50 text-gray-600 border border-gray-100'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-3">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition border border-gray-100"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl border border-gray-100">
                      {article.image}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${article.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                        {article.type === 'video' ? <Video className="w-2.5 h-2.5" /> : <FileText className="w-2.5 h-2.5" />}
                        {article.type === 'video' ? 'Video' : 'Artikel'}
                      </span>
                      <span className="text-[10px] text-gray-400">{article.duration}</span>
                    </div>
                    <h3 className="font-medium text-gray-800 text-sm line-clamp-1 mb-0.5">{article.title}</h3>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{article.description}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center">
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Tidak ada artikel ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EdukasiPage;