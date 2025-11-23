import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  FileText,
  Baby,
  ClipboardList,
  Check,
  X
} from 'lucide-react';
import { getScreeningDetail } from '../../services/kpspService';

const ScreeningDetailPage = () => {
  const navigate = useNavigate();
  const { screeningId } = useParams();
  const [screening, setScreening] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScreeningDetail();
  }, [screeningId]);

  const fetchScreeningDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getScreeningDetail(screeningId);
      setScreening(data);
    } catch (error) {
      console.error('Error fetching screening detail:', error);
      setError('Gagal memuat detail screening');
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'SESUAI':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'MERAGUKAN':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'PENYIMPANGAN':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'SESUAI':
        return <CheckCircle className="w-8 h-8" />;
      case 'MERAGUKAN':
        return <AlertCircle className="w-8 h-8" />;
      case 'PENYIMPANGAN':
        return <XCircle className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const getResultDescription = (result) => {
    switch (result) {
      case 'SESUAI':
        return 'Perkembangan anak sesuai dengan tahapan usianya';
      case 'MERAGUKAN':
        return 'Perkembangan anak perlu dipantau dan diberi stimulasi tambahan';
      case 'PENYIMPANGAN':
        return 'Kemungkinan ada penyimpangan, perlu rujukan ke ahli';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail screening...</p>
        </div>
      </div>
    );
  }

  if (error || !screening) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">{error || 'Screening tidak ditemukan'}</p>
          <button
            onClick={() => navigate('/admin/kpsp')}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold"
          >
            Kembali ke Kelola KPSP
          </button>
        </div>
      </div>
    );
  }

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const months = Math.floor((today - birth) / (1000 * 60 * 60 * 24 * 30.44));
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0) {
      return `${years} tahun ${remainingMonths} bulan`;
    }
    return `${months} bulan`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/kpsp')}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Detail Screening KPSP</h1>
              <p className="text-purple-100 mt-1">Hasil dan jawaban lengkap screening</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Child Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Baby className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Data Anak</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nama Lengkap</p>
                  <p className="font-semibold text-gray-800">{screening.child.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Lahir</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(screening.child.birthDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Usia Saat Ini</p>
                  <p className="font-semibold text-gray-800">
                    {calculateAge(screening.child.birthDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Parent Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-pink-100 rounded-xl">
                  <User className="w-6 h-6 text-pink-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Data Orang Tua</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nama</p>
                  <p className="font-semibold text-gray-800">{screening.child.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-800 break-all">{screening.child.user?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Screening Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Info Screening</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Tanggal Screening</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(screening.screeningDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kategori Usia</p>
                  <p className="font-semibold text-gray-800">{screening.category.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Usia Saat Screening</p>
                  <p className="font-semibold text-gray-800">{screening.ageAtScreening} bulan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results & Answers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Result Card */}
            <div className={`rounded-2xl shadow-md p-6 border-2 ${getResultColor(screening.result)}`}>
              <div className="flex items-center gap-4 mb-4">
                {getResultIcon(screening.result)}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">Hasil: {screening.result}</h2>
                  <p className="text-sm opacity-90">{getResultDescription(screening.result)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white/50 rounded-xl p-4 text-center">
                  <p className="text-sm opacity-75 mb-1">Jawaban Ya</p>
                  <p className="text-3xl font-bold">{screening.totalYes}</p>
                </div>
                <div className="bg-white/50 rounded-xl p-4 text-center">
                  <p className="text-sm opacity-75 mb-1">Jawaban Tidak</p>
                  <p className="text-3xl font-bold">{screening.totalNo}</p>
                </div>
                <div className="bg-white/50 rounded-xl p-4 text-center">
                  <p className="text-sm opacity-75 mb-1">Persentase</p>
                  <p className="text-3xl font-bold">
                    {Math.round((screening.totalYes / (screening.totalYes + screening.totalNo)) * 100)}%
                  </p>
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-sm font-semibold mb-2">Rekomendasi Tindakan:</p>
                <p className="text-sm">{screening.recommendedAction}</p>
              </div>

              {screening.notes && (
                <div className="bg-white/50 rounded-xl p-4 mt-4">
                  <p className="text-sm font-semibold mb-2">Catatan:</p>
                  <p className="text-sm">{screening.notes}</p>
                </div>
              )}
            </div>

            {/* Answers Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <ClipboardList className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Jawaban Pertanyaan ({screening.answers.length} pertanyaan)
                </h2>
              </div>

              <div className="space-y-4">
                {screening.answers.map((answer, index) => (
                  <div 
                    key={answer.id} 
                    className={`p-4 rounded-xl border-2 transition ${
                      answer.answer 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        answer.answer 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2">
                          {answer.question.questionText}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {answer.question.developmentArea}
                          </span>
                        </div>

                        {answer.question.instruction && (
                          <p className="text-sm text-gray-600 italic mb-2">
                            Instruksi: {answer.question.instruction}
                          </p>
                        )}

                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                          answer.answer 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-red-200 text-red-800'
                        }`}>
                          {answer.answer ? (
                            <>
                              <Check className="w-5 h-5" />
                              <span>YA - Anak dapat melakukan</span>
                            </>
                          ) : (
                            <>
                              <X className="w-5 h-5" />
                              <span>TIDAK - Anak belum dapat melakukan</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/admin/kpsp')}
                className="flex-1 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition font-semibold"
              >
                Kembali
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold"
              >
                <FileText className="w-5 h-5 inline mr-2" />
                Print / Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreeningDetailPage;