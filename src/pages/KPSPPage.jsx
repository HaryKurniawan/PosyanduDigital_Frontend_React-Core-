import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';

// Data KPSP Quiz
const KPSP_DATA = {
  '6-12': {
    name: 'KPSP 6-12 Bulan',
    usia: '6-12 Bulan',
    totalPertanyaan: 10,
    pertanyaan: [
      {
        id: 1,
        teks: 'Pada waktu bayi telentang, apakah masih ada lengan dan tungkai bergerak dengan mudah?',
        tipe: 'ya-tidak'
      },
      {
        id: 2,
        teks: 'Apakah bayi sudah bisa memegang benda kecil dengan ibu jari dan jari telunjuk?',
        tipe: 'ya-tidak'
      },
      {
        id: 3,
        teks: 'Apakah bayi sudah bisa menoleh ke arah suara?',
        tipe: 'ya-tidak'
      },
      {
        id: 4,
        teks: 'Apakah bayi sudah bisa duduk tanpa disangga?',
        tipe: 'ya-tidak'
      },
      {
        id: 5,
        teks: 'Apakah bayi sudah bisa berdiri dengan bantuan?',
        tipe: 'ya-tidak'
      },
      {
        id: 6,
        teks: 'Apakah bayi sudah bisa mengucapkan suku kata seperti "ba-ba" atau "ma-ma"?',
        tipe: 'ya-tidak'
      },
      {
        id: 7,
        teks: 'Apakah bayi sudah bisa melambaikan tangan sebagai isyarat selamat tinggal?',
        tipe: 'ya-tidak'
      },
      {
        id: 8,
        teks: 'Apakah bayi sudah bisa mencari benda yang jatuh?',
        tipe: 'ya-tidak'
      },
      {
        id: 9,
        teks: 'Apakah bayi sudah bisa menunjuk benda dengan jari telunjuk?',
        tipe: 'ya-tidak'
      },
      {
        id: 10,
        teks: 'Apakah bayi sudah bisa bermain tepuk tangan?',
        tipe: 'ya-tidak'
      }
    ]
  },
  '12-18': {
    name: 'KPSP 12-18 Bulan',
    usia: '12-18 Bulan',
    totalPertanyaan: 10,
    pertanyaan: [
      {
        id: 1,
        teks: 'Apakah bayi sudah bisa berdiri sendiri tanpa bantuan?',
        tipe: 'ya-tidak'
      },
      {
        id: 2,
        teks: 'Apakah bayi sudah bisa berjalan beberapa langkah?',
        tipe: 'ya-tidak'
      },
      {
        id: 3,
        teks: 'Apakah bayi sudah bisa menyebutkan 3 kata yang bermakna?',
        tipe: 'ya-tidak'
      },
      {
        id: 4,
        teks: 'Apakah bayi sudah bisa memahami 10 perintah sederhana?',
        tipe: 'ya-tidak'
      },
      {
        id: 5,
        teks: 'Apakah bayi sudah bisa menyusun 2 balok?',
        tipe: 'ya-tidak'
      },
      {
        id: 6,
        teks: 'Apakah bayi sudah bisa meminum dari cangkir sendiri?',
        tipe: 'ya-tidak'
      },
      {
        id: 7,
        teks: 'Apakah bayi sudah bisa menunjuk gambar di buku?',
        tipe: 'ya-tidak'
      },
      {
        id: 8,
        teks: 'Apakah bayi sudah bisa menggambar goresan?',
        tipe: 'ya-tidak'
      },
      {
        id: 9,
        teks: 'Apakah bayi sudah bisa bermain dengan mainan bergerak?',
        tipe: 'ya-tidak'
      },
      {
        id: 10,
        teks: 'Apakah bayi sudah bisa menunjuk beberapa bagian tubuhnya?',
        tipe: 'ya-tidak'
      }
    ]
  },
  '18-24': {
    name: 'KPSP 18-24 Bulan',
    usia: '18-24 Bulan',
    totalPertanyaan: 10,
    pertanyaan: [
      {
        id: 1,
        teks: 'Apakah anak sudah bisa berjalan menaiki tangga?',
        tipe: 'ya-tidak'
      },
      {
        id: 2,
        teks: 'Apakah anak sudah bisa mengatakan minimal 50 kata?',
        tipe: 'ya-tidak'
      },
      {
        id: 3,
        teks: 'Apakah anak sudah bisa membuat kalimat 2 kata?',
        tipe: 'ya-tidak'
      },
      {
        id: 4,
        teks: 'Apakah anak sudah bisa bermain dengan mainan sambil membayangkan permainan?',
        tipe: 'ya-tidak'
      },
      {
        id: 5,
        teks: 'Apakah anak sudah bisa menyusun 6 balok?',
        tipe: 'ya-tidak'
      },
      {
        id: 6,
        teks: 'Apakah anak sudah bisa makan sendiri dengan sendok?',
        tipe: 'ya-tidak'
      },
      {
        id: 7,
        teks: 'Apakah anak sudah bisa melepas pakaiannya sendiri?',
        tipe: 'ya-tidak'
      },
      {
        id: 8,
        teks: 'Apakah anak sudah bisa menunjuk gambar benda ketika disebutkan?',
        tipe: 'ya-tidak'
      },
      {
        id: 9,
        teks: 'Apakah anak sudah bisa berinteraksi dengan anak lain?',
        tipe: 'ya-tidak'
      },
      {
        id: 10,
        teks: 'Apakah anak sudah bisa menunjukkan perhatian pada gambar/cerita?',
        tipe: 'ya-tidak'
      }
    ]
  }
};

// Halaman Pilih Data Anak
const SelectChildPage = ({ onSelect, onBack }) => {
  const [children] = useState([
    { id: 1, name: 'Gibran', usia: '8 bulan', usiaBulan: 8 },
    { id: 2, name: 'Wowo', usia: '15 bulan', usiaBulan: 15 }
  ]);

  const getAgeRange = (bulan) => {
    if (bulan >= 6 && bulan < 12) return '6-12';
    if (bulan >= 12 && bulan < 18) return '12-18';
    if (bulan >= 18 && bulan <= 24) return '18-24';
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Pilih Data Anak</h1>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        <p className="text-gray-600 text-sm mb-4">Pilih anak yang akan diskrining</p>
        
        <div className="space-y-3">
          {children.map((child) => {
            const ageRange = getAgeRange(child.usiaBulan);
            return (
              <button
                key={child.id}
                onClick={() => onSelect(child, ageRange)}
                className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4 hover:shadow-lg transition text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{child.name}</h3>
                    <p className="text-sm text-gray-600">{child.usia}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      {KPSP_DATA[ageRange]?.name}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Halaman Daftar Kuis
const KPSPListPage = ({ child, ageRange, onSelectQuiz, onBack }) => {
  const quiz = KPSP_DATA[ageRange];
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">KPSP</h1>
          <p className="text-sm text-purple-100">{quiz.usia}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        <div className="bg-purple-50 rounded-2xl p-4 mb-6">
          <h2 className="font-bold text-gray-800 mb-2">Data Anak</h2>
          <p className="text-sm text-gray-700">{child.name}</p>
        </div>

        <h3 className="font-bold text-gray-800 mb-4">Pilih Kuesioner</h3>
        
        {/* Quiz Card */}
        <button
          onClick={() => onSelectQuiz(quiz)}
          className="w-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 hover:shadow-lg transition border-2 border-purple-200"
        >
          <div className="flex items-start justify-between">
            <div className="text-left">
              <h3 className="font-bold text-gray-800 mb-1">{quiz.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{quiz.totalPertanyaan} pertanyaan</p>
              <div className="inline-block bg-purple-200 text-purple-800 text-xs px-3 py-1 rounded-full font-semibold">
                Aktif untuk usia ini
              </div>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </button>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Catatan:</span> Kuesioner ini disesuaikan berdasarkan usia anak Anda. Jawab setiap pertanyaan dengan jujur untuk hasil skrining yang akurat.
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

  const question = quiz.pertanyaan[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.pertanyaan.length) * 100;
  const isAnswered = answers[question.id] !== undefined;

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [question.id]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.pertanyaan.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const yesCount = Object.values(answers).filter(ans => ans === 'ya').length;
    onComplete({
      quiz,
      child,
      answers,
      yesCount,
      totalQuestions: quiz.pertanyaan.length
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center gap-3">
          <button onClick={onBack} className="p-1">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Review Jawaban</h1>
        </div>

        <div className="p-4 pb-24">
          <div className="bg-purple-50 rounded-2xl p-4 mb-6">
            <h2 className="font-bold text-gray-800 mb-4">Ringkasan Jawaban</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {quiz.pertanyaan.map((q, idx) => (
                <div key={q.id} className="flex items-start gap-3 pb-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-sm font-semibold text-gray-600 w-6">{idx + 1}.</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-1">{q.teks}</p>
                    <span className={`inline-block text-xs px-2 py-1 rounded ${answers[q.id] === 'ya' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {answers[q.id] === 'ya' ? 'Ya' : 'Tidak'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSubmitted(false)}
              className="flex-1 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50"
            >
              Kembali Edit
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg"
            >
              Lihat Hasil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
        <button onClick={onBack} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">{quiz.name}</h1>
        <div className="text-sm">{currentQuestion + 1}/{quiz.totalPertanyaan}</div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Question */}
        <div className="mt-6 mb-8">
          <div className="bg-purple-50 rounded-2xl p-4 mb-4">
            <h3 className="font-bold text-gray-800 mb-2">Pertanyaan {currentQuestion + 1} dari {quiz.totalPertanyaan}</h3>
            <p className="text-gray-700 text-lg">{question.teks}</p>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => handleAnswer('ya')}
            className={`w-full p-4 rounded-xl font-semibold transition border-2 ${
              answers[question.id] === 'ya'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600'
                : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-green-500'
            }`}
          >
            ✓ Ya
          </button>
          <button
            onClick={() => handleAnswer('tidak')}
            className={`w-full p-4 rounded-xl font-semibold transition border-2 ${
              answers[question.id] === 'tidak'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-red-600'
                : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-red-500'
            }`}
          >
            ✗ Tidak
          </button>
        </div>

        {/* Navigation */}
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
            {currentQuestion === quiz.pertanyaan.length - 1 ? 'Review' : 'Selanjutnya'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Halaman Hasil Skrining
const ResultPage = ({ result, onBack, onNewAssessment }) => {
  const percentage = (result.yesCount / result.totalQuestions) * 100;
  let status, statusColor, icon, message;

  if (percentage >= 80) {
    status = 'Perkembangan Normal';
    statusColor = 'green';
    icon = '✓';
    message = 'Perkembangan anak Anda sesuai dengan usia. Lanjutkan pemantauan secara berkala.';
  } else if (percentage >= 50) {
    status = 'Perlu Stimulasi';
    statusColor = 'yellow';
    icon = '⚠';
    message = 'Anak Anda memerlukan stimulasi tambahan. Konsultasikan dengan petugas kesehatan.';
  } else {
    status = 'Kemungkinan Gangguan Perkembangan';
    statusColor = 'red';
    icon = '!';
    message = 'Segera konsultasikan dengan dokter atau ahli perkembangan anak.';
  }

  const colors = {
    green: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200', icon: 'bg-green-100' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200', icon: 'bg-yellow-100' },
    red: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', icon: 'bg-red-100' }
  };

  const colorScheme = colors[statusColor];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center gap-3">
        <h1 className="text-xl font-bold flex-1">Hasil Skrining</h1>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Info Anak */}
        <div className="bg-purple-50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Nama Anak</p>
          <h2 className="font-bold text-gray-800 text-lg">{result.child.name}</h2>
          <p className="text-sm text-gray-600 mt-2">Kuesioner: {result.quiz.name}</p>
        </div>

        {/* Status Card */}
        <div className={`${colorScheme.bg} border-2 ${colorScheme.border} rounded-2xl p-6 mb-6 text-center`}>
          <div className={`${colorScheme.icon} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
            {icon}
          </div>
          <h3 className={`${colorScheme.text} font-bold text-lg mb-2`}>{status}</h3>
          <p className={`${colorScheme.text} text-sm`}>{message}</p>
        </div>

        {/* Score */}
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
          <p className="text-xs text-gray-600 mt-2">{result.yesCount} dari {result.totalQuestions} jawaban "Ya"</p>
        </div>

        {/* Details */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
          <h4 className="font-bold text-blue-900 mb-3">Interpretasi Hasil</h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>80-100%:</strong> Perkembangan Normal - Lanjutkan pemantauan rutin</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>50-79%:</strong> Perlu Stimulasi - Berikan rangsangan tambahan</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span><strong>Dibawah 50%:</strong> Kemungkinan Gangguan - Perlu evaluasi lebih lanjut</span>
            </li>
          </ul>
        </div>

        {/* Buttons */}
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
  const [currentPage, setCurrentPage] = useState('select-child'); // select-child, quiz-list, quiz, result
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleSelectChild = (child, ageRange) => {
    setSelectedChild(child);
    setSelectedAgeRange(ageRange);
    setCurrentPage('quiz-list');
  };

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentPage('quiz');
  };

  const handleCompleteQuiz = (result) => {
    setCurrentPage('result');
    setSelectedQuiz({ ...selectedQuiz, result });
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
    setSelectedAgeRange(null);
    setSelectedQuiz(null);
    setCurrentPage('select-child');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {currentPage === 'select-child' && (
        <SelectChildPage onSelect={handleSelectChild} onBack={() => {}} />
      )}
      
      {currentPage === 'quiz-list' && selectedChild && selectedAgeRange && (
        <KPSPListPage 
          child={selectedChild} 
          ageRange={selectedAgeRange}
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
      
      {currentPage === 'result' && selectedQuiz?.result && (
        <ResultPage 
          result={selectedQuiz.result}
          onBack={handleNewAssessment}
          onNewAssessment={handleNewAssessment}
        />
      )}
    </div>
  );
}