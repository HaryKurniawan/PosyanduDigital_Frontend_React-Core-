import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import {
  getMyChildren,
  getKPSPCategoryByCode,
  submitKPSPScreening,
  getChildScreeningHistory
} from '../services/kpspService';
import PageHeader from '../components/PageHeader';

// Helper function to determine age range
const getAgeRange = (ageInMonths) => {
  if (ageInMonths >= 0 && ageInMonths < 6) return '0-6';
  if (ageInMonths >= 6 && ageInMonths < 12) return '6-12';
  if (ageInMonths >= 12 && ageInMonths < 18) return '12-18';
  if (ageInMonths >= 18 && ageInMonths <= 24) return '18-24';
  return null;
};

// Halaman Pilih Data Anak
const SelectChildPage = ({ onSelect, onBack, completedScreenings }) => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const data = await getMyChildren();
      setChildren(data);
    } catch (err) {
      setError('Gagal memuat data anak');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data anak...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchChildren}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Pilih Data Anak" backTo="/home" />

      <div className="px-4 py-4 pb-24">
        <p className="text-gray-600 text-sm mb-4">Pilih anak yang akan diskrining</p>

        {children.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada data anak</p>
          </div>
        ) : (
          <div className="space-y-3">
            {children.map((child) => {
              const ageRange = getAgeRange(child.ageInMonths);
              const canScreen = ageRange !== null;
              const isCompleted = completedScreenings.includes(child.id);

              return (
                <button
                  key={child.id}
                  onClick={() => canScreen && !isCompleted && onSelect(child, ageRange)}
                  disabled={!canScreen || isCompleted}
                  className={`w-full bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4 transition text-left ${!canScreen || isCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800">{child.fullName}</h3>
                      <p className="text-sm text-gray-600">{child.ageInMonths} bulan</p>
                    </div>
                    <div className="text-right">
                      {isCompleted ? (
                        <div className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle size={14} />
                          SUDAH DIISI
                        </div>
                      ) : canScreen ? (
                        <p className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                          KPSP {ageRange} Bulan
                        </p>
                      ) : (
                        <p className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          Usia tidak sesuai
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Halaman Daftar Kuis
const KPSPListPage = ({ child, onSelectQuiz, onBack }) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategory();
  }, [child]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const code = `KPSP_${child.ageRange.replace('-', '_')}`;
      const data = await getKPSPCategoryByCode(code);
      setCategory(data);
    } catch (err) {
      setError('Gagal memuat kuesioner');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error || 'Kuesioner tidak ditemukan'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="KPSP" onBack={onBack} />

      <div className="px-4 py-4 pb-24">
        <div className="bg-purple-50 rounded-2xl p-4 mb-6">
          <h2 className="font-bold text-gray-800 mb-2">Data Anak</h2>
          <p className="text-sm text-gray-700">{child.fullName}</p>
          <p className="text-xs text-gray-600 mt-1">{child.ageInMonths} bulan</p>
        </div>

        <h3 className="font-bold text-gray-800 mb-4">Pilih Kuesioner</h3>

        <button
          onClick={() => onSelectQuiz(category)}
          className="w-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 hover:shadow-lg transition border-2 border-purple-200"
        >
          <div className="flex items-start justify-between">
            <div className="text-left">
              <h3 className="font-bold text-gray-800 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{category.questions.length} pertanyaan</p>
              <div className="inline-block bg-purple-200 text-purple-800 text-xs px-3 py-1 rounded-full font-semibold">
                Aktif untuk usia ini
              </div>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </button>

        <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <span className="font-semibold">⚠️ PERHATIAN:</span> Anda hanya dapat mengisi kuesioner ini SATU KALI. Pastikan semua pertanyaan dijawab dengan benar sebelum mengirim!
          </p>
        </div>
      </div>
    </div>
  );
};

// Halaman Quiz
const QuizPage = ({ quiz, child, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isAnswered = answers[question.id] !== undefined;
  const allAnswered = quiz.questions.every(q => answers[q.id] !== undefined);

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [question.id]: value
    });
    setValidationError(null);
  };

  const handleNext = () => {
    if (!isAnswered) {
      setValidationError('Pertanyaan ini harus dijawab sebelum melanjutkan');
      return;
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setValidationError(null);
    } else {
      setSubmitted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setValidationError(null);
    }
  };

  const handleSubmit = async () => {
    // Validasi semua pertanyaan sudah dijawab
    if (!allAnswered) {
      setValidationError('Semua pertanyaan harus dijawab sebelum mengirim');
      return;
    }

    try {
      setSubmitting(true);

      const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer: answer === 'ya'
      }));

      const screeningData = {
        childId: child.id,
        categoryId: quiz.id,
        answers: answersArray,
        ageAtScreening: child.ageInMonths,
        notes: ''
      };

      const result = await submitKPSPScreening(screeningData);

      onComplete({
        ...result.data,
        child,
        quiz
      });
    } catch (error) {
      console.error('Error submitting screening:', error);
      alert('Gagal menyimpan hasil skrining. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title="Review Jawaban" onBack={onBack} />

        <div className="px-4 py-4 pb-24">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">📋 REVIEW JAWABAN:</span> Periksa kembali semua jawaban Anda. Pastikan semuanya benar karena data ini hanya dapat dikirim SATU KALI.
            </p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 mb-6">
            <h2 className="font-bold text-gray-800 mb-4">Ringkasan Jawaban</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {quiz.questions.map((q, idx) => (
                <div key={q.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-b-0">
                  <span className="text-sm font-semibold text-gray-600 w-6">{idx + 1}.</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-2 font-medium">{q.questionText}</p>
                    <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${answers[q.id] === 'ya'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                      }`}>
                      {answers[q.id] === 'ya' ? '✓ Ya' : '✗ Tidak'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
            <h3 className="font-bold text-blue-900 mb-2">Rekapitulasi</h3>
            <p className="text-sm text-blue-800">
              Total Pertanyaan: <span className="font-bold">{quiz.questions.length}</span><br />
              Jawaban "Ya": <span className="font-bold text-green-600">{Object.values(answers).filter(a => a === 'ya').length}</span><br />
              Jawaban "Tidak": <span className="font-bold text-red-600">{Object.values(answers).filter(a => a === 'tidak').length}</span>
            </p>
          </div>

          {validationError && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800">{validationError}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setSubmitted(false)}
              disabled={submitting}
              className="flex-1 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 disabled:opacity-50"
            >
              ← Kembali Edit
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !allAnswered}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                '✓ Kirim Jawaban'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title={quiz.name}
        onBack={onBack}
        rightElement={<span className="text-sm text-gray-500">{currentQuestion + 1}/{quiz.questions.length}</span>}
      />

      <div className="h-1 bg-gray-200 fixed top-14 left-0 right-0 z-40">
        <div className="h-full bg-pink-500 transition-all" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="pt-2 px-4 pb-24">
        <div className="mt-6 mb-8">
          <div className="bg-purple-50 rounded-2xl p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-2">Pertanyaan {currentQuestion + 1} dari {quiz.questions.length}</h3>
            <p className="text-gray-700 text-lg">{question.questionText}</p>
            {question.instruction && (
              <p className="text-sm text-gray-500 mt-2 italic">{question.instruction}</p>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <button
            onClick={() => handleAnswer('ya')}
            className={`w-full p-4 rounded-xl font-semibold transition border-2 ${answers[question.id] === 'ya'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600'
              : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-green-500'
              }`}
          >
            ✓ Ya
          </button>
          <button
            onClick={() => handleAnswer('tidak')}
            className={`w-full p-4 rounded-xl font-semibold transition border-2 ${answers[question.id] === 'tidak'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-600'
              : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-red-500'
              }`}
          >
            ✗ Tidak
          </button>
        </div>

        {validationError && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800">{validationError}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sebelumnya
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Review →' : 'Selanjutnya →'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Halaman Hasil Skrining
const ResultPage = ({ result, onBack, onNewAssessment }) => {
  const percentage = (result.totalYes / (result.totalYes + result.totalNo)) * 100;

  const getStatusInfo = () => {
    if (result.result === 'SESUAI') {
      return {
        status: 'Perkembangan Normal',
        color: 'green',
        icon: '✓',
        message: result.recommendedAction
      };
    } else if (result.result === 'MERAGUKAN') {
      return {
        status: 'Perlu Stimulasi',
        color: 'yellow',
        icon: '⚠',
        message: result.recommendedAction
      };
    } else {
      return {
        status: 'Kemungkinan Gangguan Perkembangan',
        color: 'red',
        icon: '!',
        message: result.recommendedAction
      };
    }
  };

  const statusInfo = getStatusInfo();

  const colors = {
    green: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200', icon: 'bg-green-100' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200', icon: 'bg-yellow-100' },
    red: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', icon: 'bg-red-100' }
  };

  const colorScheme = colors[statusInfo.color];

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Hasil Skrining" />

      <div className="px-4 py-4 pb-24">
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm font-semibold text-green-700">JAWABAN BERHASIL DIKIRIM</p>
          </div>
          <p className="text-xs text-green-600">Hasil screening telah dikirim ke Petugas Pondasnadu untuk ditinjau lebih lanjut</p>
        </div>

        <div className="bg-purple-50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Nama Anak</p>
          <h2 className="font-bold text-gray-800 text-lg">{result.child.fullName}</h2>
          <p className="text-sm text-gray-600 mt-2">Kuesioner: {result.category.name}</p>
          <p className="text-xs text-gray-500 mt-1">
            Tanggal: {new Date(result.screeningDate).toLocaleDateString('id-ID')}
          </p>
        </div>

        <div className={`${colorScheme.bg} border-2 ${colorScheme.border} rounded-2xl p-6 mb-6 text-center`}>
          <div className={`${colorScheme.icon} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
            {statusInfo.icon}
          </div>
          <h3 className={`${colorScheme.text} font-bold text-lg mb-2`}>{statusInfo.status}</h3>
          <p className={`${colorScheme.text} text-sm`}>{statusInfo.message}</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <p className="text-gray-600 text-sm mb-2">Skor Hasil</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="font-bold text-2xl text-purple-600">{Math.round(percentage)}%</div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {result.totalYes} dari {result.totalYes + result.totalNo} jawaban "Ya"
          </p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
          <h4 className="font-bold text-blue-900 mb-3">Interpretasi Hasil</h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>SESUAI (80-100%):</strong> Perkembangan Normal - Lanjutkan pemantauan rutin</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>MERAGUKAN (50-79%):</strong> Perlu Stimulasi - Berikan rangsangan tambahan</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>PENYIMPANGAN (&lt;50%):</strong> Kemungkinan Gangguan - Perlu evaluasi lebih lanjut</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50"
          >
            Kembali
          </button>
          <button
            onClick={onNewAssessment}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg"
          >
            Skrining Baru
          </button>
        </div>
      </div>
    </div>
  );
};

// Main KPSP Page Component
export default function KPSPPage() {
  const [currentPage, setCurrentPage] = useState('select-child');
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [completedScreenings, setCompletedScreenings] = useState([]);

  useEffect(() => {
    loadCompletedScreenings();
  }, []);

  const loadCompletedScreenings = async () => {
    try {
      const myChildren = await getMyChildren();
      const completed = [];

      for (const child of myChildren) {
        const history = await getChildScreeningHistory(child.id);
        if (history && history.length > 0) {
          completed.push(child.id);
        }
      }

      setCompletedScreenings(completed);
    } catch (err) {
      console.error('Error loading screening history:', err);
    }
  };

  const handleSelectChild = (child, ageRange) => {
    setSelectedChild({ ...child, ageRange });
    setCurrentPage('quiz-list');
  };

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentPage('quiz');
  };

  const handleCompleteQuiz = (completionResult) => {
    setResult(completionResult);
    setCompletedScreenings([...completedScreenings, completionResult.child.id]);
    setCurrentPage('result');
  };

  const handleBack = () => {
    if (currentPage === 'result') {
      setCurrentPage('quiz');
    } else if (currentPage === 'quiz') {
      setCurrentPage('quiz-list');
    } else if (currentPage === 'quiz-list') {
      setCurrentPage('select-child');
    }
  };

  const handleNewAssessment = () => {
    setSelectedChild(null);
    setSelectedQuiz(null);
    setResult(null);
    setCurrentPage('select-child');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {currentPage === 'select-child' && (
        <SelectChildPage
          onSelect={handleSelectChild}
          onBack={() => { }}
          completedScreenings={completedScreenings}
        />
      )}

      {currentPage === 'quiz-list' && selectedChild && (
        <KPSPListPage
          child={selectedChild}
          onSelectQuiz={handleSelectQuiz}
          onBack={handleBack}
        />
      )}

      {currentPage === 'quiz' && selectedQuiz && (
        <QuizPage
          quiz={selectedQuiz}
          child={selectedChild}
          onComplete={handleCompleteQuiz}
          onBack={handleBack}
        />
      )}

      {currentPage === 'result' && result && (
        <ResultPage
          result={result}
          onBack={handleNewAssessment}
          onNewAssessment={handleNewAssessment}
        />
      )}
    </div>
  );
}