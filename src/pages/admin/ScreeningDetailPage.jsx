import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle, AlertCircle, XCircle, Calendar, User, Baby } from 'lucide-react';
import { getScreeningDetail } from '../../services/kpspService';

const ScreeningDetailPage = () => {
  const navigate = useNavigate();
  const { screeningId } = useParams();
  const [screening, setScreening] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScreeningDetail();
  }, [screeningId]);

  const fetchScreeningDetail = async () => {
    try {
      setLoading(true);
      // Note: Admin perlu endpoint khusus untuk getScreeningDetail
      // Untuk sementara gunakan endpoint yang sama
      const data = await getScreeningDetail(screeningId);
      setScreening(data);
    } catch (error) {
      console.error('Error fetching screening detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultInfo = () => {
    if (!screening) return null;

    if (screening.result === 'SESUAI') {
      return {
        color: 'green',
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconBg: 'bg-green-100'
      };
    } else if (screening.result === 'MERAGUKAN') {
      return {
        color: 'yellow',
        icon: AlertCircle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        iconBg: 'bg-yellow-100'
      };
    } else {
      return {
        color: 'red',
        icon: XCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconBg: 'bg-red-100'
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail screening...</p>
        </div>
      </div>
    );
  }

  if (!screening) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Data screening tidak ditemukan</p>
          <button
            onClick={() => navigate('/admin/kelola-kpsp')}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const resultInfo = getResultInfo();
  const ResultIcon = resultInfo.icon;
  const percentage = (screening.totalYes / (screening.totalYes + screening.totalNo)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/kelola-kpsp')}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Detail Hasil Screening KPSP</h1>
              <p className="text-purple-100 text-sm mt-1">
                {new Date(screening.screeningDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Baby className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Data Anak</p>
                <p className="font-bold text-gray-800">{screening.child.fullName}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>NIK: {screening.child.nik}</p>
              <p>Usia saat screening: {screening.ageAtScreening} bulan</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Orang Tua</p>
                <p className="font-bold text-gray-800">{screening.child.user.name}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>{screening.child.user.email}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kategori</p>
                <p className="font-bold text-gray-800">{screening.category.name}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>{screening.category.code}</p>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className={`${resultInfo.bgColor} border-2 ${resultInfo.borderColor} rounded-2xl p-8 mb-8`}>
          <div className="flex items-start gap-6">
            <div className={`${resultInfo.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <ResultIcon className={`w-10 h-10 ${resultInfo.textColor}`} />
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${resultInfo.textColor} mb-2`}>
                {screening.result}
              </h2>
              <p className={`${resultInfo.textColor} mb-4`}>
                {screening.recommendedAction}
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Skor</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {screening.totalYes}/{screening.totalYes + screening.totalNo}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Persentase</p>
                  <p className="text-3xl font-bold text-gray-800">{Math.round(percentage)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Visualisasi Skor</h3>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all"
                style={{ width: `${percentage}%` }}
              >
                {Math.round(percentage)}%
              </div>
            </div>
            <div className="flex justify-between mt-3 text-xs text-gray-600">
              <span>0%</span>
              <span>50%</span>
              <span>80%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Detailed Answers */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h3 className="font-bold text-gray-800 mb-6">Detail Jawaban</h3>
          <div className="space-y-4">
            {screening.answers.map((answer, index) => (
              <div
                key={answer.id}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 ${
                  answer.answer
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  answer.answer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium mb-2">
                    {answer.question.questionText}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {answer.question.developmentArea}
                    </span>
                    <span className={`px-3 py-1 rounded-full font-bold ${
                      answer.answer
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {answer.answer ? '✓ YA' : '✗ TIDAK'}
                    </span>
                  </div>
                  {answer.question.instruction && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      Instruksi: {answer.question.instruction}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {screening.notes && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-gray-800 mb-3">Catatan</h3>
            <p className="text-gray-700">{screening.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreeningDetailPage;