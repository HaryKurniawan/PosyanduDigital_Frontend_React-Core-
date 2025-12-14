import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Baby,
    TrendingUp,
    Activity,
    AlertCircle,
    CheckCircle,
    Scale,
    Ruler,
    Brain
} from 'lucide-react';
import { getMyChildrenGrowthStatus, getChildGrowthAnalysis, getGrowthHistory, updateChildGender } from '../services/growthService';
import MobileContainer from '../components/MobileContainer';
import PageHeader from '../components/PageHeader';

const TumbuhKembangPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [childAnalysis, setChildAnalysis] = useState(null);
    const [growthHistory, setGrowthHistory] = useState([]);
    const [showGenderModal, setShowGenderModal] = useState(false);
    const [pendingGenderChild, setPendingGenderChild] = useState(null);

    useEffect(() => {
        fetchChildrenStatus();
    }, []);

    const fetchChildrenStatus = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getMyChildrenGrowthStatus();
            setChildren(data);
            if (data.length > 0) {
                handleSelectChild(data[0]);
            }
        } catch (err) {
            console.error('Error fetching children:', err);
            setError('Gagal memuat data anak');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChild = async (child) => {
        try {
            setSelectedChild(child);
            setLoading(true);
            const [analysis, history] = await Promise.all([
                getChildGrowthAnalysis(child.child.id),
                getGrowthHistory(child.child.id)
            ]);
            setChildAnalysis(analysis);
            setGrowthHistory(history.history || []);
        } catch (err) {
            console.error('Error fetching analysis:', err);
            setError('Gagal memuat analisis');
        } finally {
            setLoading(false);
        }
    };

    const handleGenderUpdate = async (gender) => {
        if (!pendingGenderChild) return;
        try {
            await updateChildGender(pendingGenderChild.child.id, gender);
            setShowGenderModal(false);
            setPendingGenderChild(null);
            fetchChildrenStatus();
        } catch (err) {
            console.error('Error updating gender:', err);
            alert('Gagal mengupdate jenis kelamin');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatAge = (months) => {
        if (months < 12) return `${months} bulan`;
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        return remainingMonths === 0 ? `${years} tahun` : `${years} tahun ${remainingMonths} bulan`;
    };

    const getStatusColor = (color) => {
        const colors = {
            green: 'bg-green-100 text-green-700 border-green-200',
            yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            orange: 'bg-orange-100 text-orange-700 border-orange-200',
            red: 'bg-red-100 text-red-700 border-red-200',
            blue: 'bg-blue-100 text-blue-700 border-blue-200',
            gray: 'bg-gray-100 text-gray-700 border-gray-200'
        };
        return colors[color] || colors.gray;
    };

    const getZScoreBar = (zScore) => {
        if (zScore === null) return 50;
        return Math.min(100, Math.max(0, ((zScore + 3) / 6) * 100));
    };

    const getZScoreColor = (zScore) => {
        if (zScore === null) return 'bg-gray-300';
        if (zScore < -2) return 'bg-red-500';
        if (zScore < -1) return 'bg-yellow-500';
        if (zScore <= 1) return 'bg-green-500';
        if (zScore <= 2) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Loading state
    if (loading && children.length === 0) {
        return (
            <MobileContainer>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500 mx-auto"></div>
                        <p className="mt-4 text-gray-500 text-sm">Memuat data...</p>
                    </div>
                </div>
            </MobileContainer>
        );
    }

    // Error state
    if (error && children.length === 0) {
        return (
            <MobileContainer>
                <PageHeader title="Tumbuh Kembang" backTo="/home" />
                <div className="flex items-center justify-center p-6 min-h-[60vh]">
                    <div className="text-center">
                        <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
                        <p className="text-gray-500 text-sm mb-4">{error}</p>
                        <button
                            onClick={fetchChildrenStatus}
                            className="px-6 py-2 bg-pink-500 text-white rounded-xl text-sm font-medium hover:bg-pink-600 transition"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </MobileContainer>
        );
    }

    return (
        <MobileContainer>
            <PageHeader title="Tumbuh Kembang" backTo="/home" />

            <div className="p-4 pb-8">
                {/* No Children */}
                {children.length === 0 ? (
                    <div className="bg-gray-50 rounded-2xl p-8 text-center">
                        <Baby className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-1">Belum ada data anak</p>
                        <p className="text-sm text-gray-400">Tambahkan data anak terlebih dahulu</p>
                    </div>
                ) : (
                    <>
                        {/* Child Selector */}
                        {children.length > 1 && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Anak</label>
                                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                                    {children.map((child) => (
                                        <button
                                            key={child.child.id}
                                            onClick={() => handleSelectChild(child)}
                                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${selectedChild?.child.id === child.child.id
                                                ? 'bg-pink-500 text-white'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {child.child.fullName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Overall Status Card */}
                        {childAnalysis && (
                            <div className={`rounded-2xl p-4 mb-4 border ${childAnalysis.overallStatus?.color === 'green' ? 'bg-green-50 border-green-200' :
                                childAnalysis.overallStatus?.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                                    childAnalysis.overallStatus?.color === 'red' ? 'bg-red-50 border-red-200' :
                                        'bg-gray-50 border-gray-200'
                                }`}>
                                <div className="flex items-start gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${childAnalysis.overallStatus?.color === 'green' ? 'bg-green-200' :
                                        childAnalysis.overallStatus?.color === 'orange' ? 'bg-orange-200' :
                                            childAnalysis.overallStatus?.color === 'red' ? 'bg-red-200' :
                                                'bg-gray-200'
                                        }`}>
                                        {childAnalysis.overallStatus?.color === 'green' ? (
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        ) : (
                                            <AlertCircle className={`w-6 h-6 ${childAnalysis.overallStatus?.color === 'red' ? 'text-red-600' : 'text-orange-600'
                                                }`} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-bold text-gray-800 truncate">{childAnalysis.child?.fullName}</h2>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {formatAge(childAnalysis.child?.ageMonths)} • {childAnalysis.child?.gender === 'P' ? 'Perempuan' : 'Laki-laki'}
                                        </p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${childAnalysis.overallStatus?.color === 'green' ? 'bg-green-200 text-green-800' :
                                            childAnalysis.overallStatus?.color === 'orange' ? 'bg-orange-200 text-orange-800' :
                                                childAnalysis.overallStatus?.color === 'red' ? 'bg-red-200 text-red-800' :
                                                    'bg-gray-200 text-gray-800'
                                            }`}>
                                            {childAnalysis.overallStatus?.overallStatus || 'Status tidak tersedia'}
                                        </span>
                                    </div>
                                </div>
                                {childAnalysis.overallStatus?.recommendation && (
                                    <div className="mt-3 p-3 bg-white/70 rounded-xl">
                                        <p className="text-xs text-gray-600">💡 {childAnalysis.overallStatus.recommendation}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STUNTING ALERT BANNER */}
                        {childAnalysis?.hasExamination && childAnalysis.zScores?.heightForAge?.value < -2 && (
                            <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-4 mb-4 text-white shadow-lg">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm mb-1">⚠️ PERINGATAN STUNTING</h3>
                                        <p className="text-xs text-white/90 mb-2">
                                            {childAnalysis.zScores.heightForAge.value < -3
                                                ? 'Anak Anda terdeteksi STUNTING BERAT. Segera konsultasi ke dokter atau puskesmas untuk penanganan intensif.'
                                                : 'Anak Anda terdeteksi STUNTING. Perhatikan asupan gizi dan segera konsultasi ke posyandu atau puskesmas.'}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="bg-white/20 px-2 py-1 rounded">
                                                Z-Score: {childAnalysis.zScores.heightForAge.value.toFixed(1)}
                                            </span>
                                            <span className="bg-white/20 px-2 py-1 rounded">
                                                {childAnalysis.zScores.heightForAge.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-white/20">
                                    <p className="text-[10px] text-white/80">
                                        📞 Hubungi kader posyandu atau puskesmas terdekat untuk konsultasi lebih lanjut
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* WASTING/OBESITY ALERT */}
                        {childAnalysis?.hasExamination && (
                            childAnalysis.zScores?.weightForHeight?.value < -2 ||
                            childAnalysis.zScores?.weightForHeight?.value > 2
                        ) && (
                                <div className={`rounded-2xl p-4 mb-4 border-2 ${childAnalysis.zScores?.weightForHeight?.value < -2
                                    ? 'bg-orange-50 border-orange-300'
                                    : 'bg-yellow-50 border-yellow-300'
                                    }`}>
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className={`w-5 h-5 flex-shrink-0 ${childAnalysis.zScores?.weightForHeight?.value < -2
                                            ? 'text-orange-600'
                                            : 'text-yellow-600'
                                            }`} />
                                        <div>
                                            <h3 className={`font-bold text-sm mb-1 ${childAnalysis.zScores?.weightForHeight?.value < -2
                                                ? 'text-orange-800'
                                                : 'text-yellow-800'
                                                }`}>
                                                {childAnalysis.zScores?.weightForHeight?.value < -2
                                                    ? '⚠️ Masalah Berat Badan Kurang'
                                                    : '⚠️ Masalah Kelebihan Berat Badan'}
                                            </h3>
                                            <p className={`text-xs ${childAnalysis.zScores?.weightForHeight?.value < -2
                                                ? 'text-orange-700'
                                                : 'text-yellow-700'
                                                }`}>
                                                {childAnalysis.zScores?.weightForHeight?.value < -2
                                                    ? 'Berat badan anak kurang untuk tinggi badannya. Tingkatkan asupan gizi.'
                                                    : 'Berat badan anak berlebih. Perhatikan pola makan dan aktivitas fisik.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* No Examination Data */}
                        {childAnalysis && !childAnalysis.hasExamination && (
                            <div className="bg-gray-50 rounded-2xl p-6 text-center mb-4">
                                <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-600 text-sm mb-1">Belum ada data pemeriksaan</p>
                                <p className="text-xs text-gray-400">Data akan muncul setelah pemeriksaan di posyandu</p>
                            </div>
                        )}

                        {/* Z-Score Indicators */}
                        {childAnalysis?.hasExamination && childAnalysis.zScores && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm">
                                    <Activity className="w-4 h-4 text-pink-500" />
                                    Indikator Z-Score WHO
                                </h3>
                                <div className="space-y-3">
                                    {/* BB/U */}
                                    <ZScoreIndicator
                                        icon={<Scale className="w-4 h-4 text-blue-500" />}
                                        label="BB/U"
                                        sublabel="Berat menurut Umur"
                                        zScore={childAnalysis.zScores.weightForAge}
                                        getStatusColor={getStatusColor}
                                        getZScoreBar={getZScoreBar}
                                        getZScoreColor={getZScoreColor}
                                        median={`${childAnalysis.zScores.weightForAge?.median?.toFixed(1)} kg`}
                                        actual={`${childAnalysis.latestExamination?.weight} kg`}
                                    />
                                    {/* TB/U */}
                                    <ZScoreIndicator
                                        icon={<Ruler className="w-4 h-4 text-green-500" />}
                                        label="TB/U"
                                        sublabel="Tinggi menurut Umur"
                                        zScore={childAnalysis.zScores.heightForAge}
                                        getStatusColor={getStatusColor}
                                        getZScoreBar={getZScoreBar}
                                        getZScoreColor={getZScoreColor}
                                        median={`${childAnalysis.zScores.heightForAge?.median?.toFixed(1)} cm`}
                                        actual={`${childAnalysis.latestExamination?.height} cm`}
                                        showStuntingWarning={childAnalysis.zScores.heightForAge?.value < -2}
                                    />
                                    {/* BB/TB */}
                                    <ZScoreIndicator
                                        icon={<TrendingUp className="w-4 h-4 text-orange-500" />}
                                        label="BB/TB"
                                        sublabel="Proporsi Tubuh"
                                        zScore={childAnalysis.zScores.weightForHeight}
                                        getStatusColor={getStatusColor}
                                        getZScoreBar={getZScoreBar}
                                        getZScoreColor={getZScoreColor}
                                        median={`${childAnalysis.zScores.weightForHeight?.median?.toFixed(1)} kg`}
                                    />
                                    {/* LK/U */}
                                    <ZScoreIndicator
                                        icon={<Brain className="w-4 h-4 text-purple-500" />}
                                        label="LK/U"
                                        sublabel="Lingkar Kepala"
                                        zScore={childAnalysis.zScores.headCircumferenceForAge}
                                        getStatusColor={getStatusColor}
                                        getZScoreBar={getZScoreBar}
                                        getZScoreColor={getZScoreColor}
                                        median={`${childAnalysis.zScores.headCircumferenceForAge?.median?.toFixed(1)} cm`}
                                        actual={`${childAnalysis.latestExamination?.headCircumference} cm`}
                                    />
                                </div>
                                {/* Legend */}
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span>&lt;-2 / &gt;+2</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span>Risiko</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span>Normal</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recommendations */}
                        {childAnalysis?.recommendations && childAnalysis.recommendations.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Rekomendasi
                                </h3>
                                <div className="space-y-3">
                                    {childAnalysis.recommendations.map((rec, idx) => (
                                        <div key={idx} className={`p-3 rounded-xl text-xs ${rec.priority === 'high' ? 'bg-red-50 border border-red-100' :
                                            rec.priority === 'medium' ? 'bg-yellow-50 border border-yellow-100' :
                                                'bg-green-50 border border-green-100'
                                            }`}>
                                            <h4 className={`font-medium mb-1.5 ${rec.priority === 'high' ? 'text-red-800' :
                                                rec.priority === 'medium' ? 'text-yellow-800' :
                                                    'text-green-800'
                                                }`}>{rec.area}</h4>
                                            <ul className="space-y-1 text-gray-600">
                                                {rec.actions.map((action, i) => (
                                                    <li key={i} className="flex items-start gap-1.5">
                                                        <span className="text-gray-400">•</span>
                                                        <span>{action}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Latest Examination */}
                        {childAnalysis?.latestExamination && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                                    <Activity className="w-4 h-4 text-blue-500" />
                                    Pemeriksaan Terakhir
                                </h3>
                                <p className="text-xs text-gray-500 mb-3">{formatDate(childAnalysis.latestExamination.date)}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-blue-50 p-3 rounded-xl text-center">
                                        <p className="text-[10px] text-gray-500 uppercase">Berat</p>
                                        <p className="text-lg font-bold text-blue-600">{childAnalysis.latestExamination.weight}<span className="text-xs font-normal ml-0.5">kg</span></p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-xl text-center">
                                        <p className="text-[10px] text-gray-500 uppercase">Tinggi</p>
                                        <p className="text-lg font-bold text-green-600">{childAnalysis.latestExamination.height}<span className="text-xs font-normal ml-0.5">cm</span></p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-xl text-center">
                                        <p className="text-[10px] text-gray-500 uppercase">L. Kepala</p>
                                        <p className="text-lg font-bold text-purple-600">{childAnalysis.latestExamination.headCircumference}<span className="text-xs font-normal ml-0.5">cm</span></p>
                                    </div>
                                    <div className="bg-orange-50 p-3 rounded-xl text-center">
                                        <p className="text-[10px] text-gray-500 uppercase">L. Lengan</p>
                                        <p className="text-lg font-bold text-orange-600">{childAnalysis.latestExamination.armCircumference}<span className="text-xs font-normal ml-0.5">cm</span></p>
                                    </div>
                                </div>

                                {/* Kader Notes Section */}
                                {(childAnalysis.latestExamination.notes || childAnalysis.latestExamination.immunization) && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <h4 className="text-xs font-medium text-gray-600 mb-2">📋 Catatan Kader</h4>
                                        {childAnalysis.latestExamination.immunization && childAnalysis.latestExamination.immunization !== '-' && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                                                    💉 {childAnalysis.latestExamination.immunization}
                                                </span>
                                            </div>
                                        )}
                                        {childAnalysis.latestExamination.notes && (
                                            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                                                {childAnalysis.latestExamination.notes}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Growth History */}
                        {growthHistory.length > 1 && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                                    <TrendingUp className="w-4 h-4 text-pink-500" />
                                    Riwayat Pertumbuhan
                                </h3>
                                <div className="overflow-x-auto -mx-4 px-4">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-gray-500">
                                                <th className="text-left py-2 font-medium">Tanggal</th>
                                                <th className="text-right py-2 font-medium">BB</th>
                                                <th className="text-right py-2 font-medium">TB</th>
                                                <th className="text-right py-2 font-medium">Z-BB</th>
                                                <th className="text-right py-2 font-medium">Z-TB</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {growthHistory.slice().reverse().slice(0, 5).map((item, idx) => (
                                                <tr key={idx} className="border-b border-gray-50">
                                                    <td className="py-2 text-gray-600">{formatDate(item.date)}</td>
                                                    <td className="py-2 text-right text-gray-600">{item.measurements.weight}</td>
                                                    <td className="py-2 text-right text-gray-600">{item.measurements.height}</td>
                                                    <td className={`py-2 text-right font-medium ${item.zScores.weightForAge < -2 ? 'text-red-500' :
                                                        item.zScores.weightForAge < -1 ? 'text-yellow-500' : 'text-green-500'
                                                        }`}>{item.zScores.weightForAge?.toFixed(1) || '-'}</td>
                                                    <td className={`py-2 text-right font-medium ${item.zScores.heightForAge < -2 ? 'text-red-500' :
                                                        item.zScores.heightForAge < -1 ? 'text-yellow-500' : 'text-green-500'
                                                        }`}>{item.zScores.heightForAge?.toFixed(1) || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Gender Modal */}
            {showGenderModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-5 max-w-xs w-full">
                        <h3 className="text-base font-bold text-gray-800 mb-2">Pilih Jenis Kelamin</h3>
                        <p className="text-xs text-gray-500 mb-4">Diperlukan untuk perhitungan Z-Score yang akurat</p>
                        <div className="flex gap-2">
                            <button onClick={() => handleGenderUpdate('L')} className="flex-1 py-3 bg-blue-100 text-blue-700 rounded-xl font-medium text-sm hover:bg-blue-200 transition">👦 Laki-laki</button>
                            <button onClick={() => handleGenderUpdate('P')} className="flex-1 py-3 bg-pink-100 text-pink-700 rounded-xl font-medium text-sm hover:bg-pink-200 transition">👧 Perempuan</button>
                        </div>
                        <button onClick={() => { setShowGenderModal(false); setPendingGenderChild(null); }} className="w-full mt-2 py-2 text-gray-500 text-sm hover:text-gray-700 transition">Batal</button>
                    </div>
                </div>
            )}
        </MobileContainer>
    );
};

// Z-Score Indicator Component
const ZScoreIndicator = ({ icon, label, sublabel, zScore, getStatusColor, getZScoreBar, getZScoreColor, median, actual, showStuntingWarning }) => (
    <div className="p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                {icon}
                <span className="font-medium text-gray-700 text-sm">{label}</span>
                <span className="text-[10px] text-gray-400">{sublabel}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${getStatusColor(zScore?.color)}`}>{zScore?.status}</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 flex">
                    <div className="w-1/6 bg-red-200"></div>
                    <div className="w-1/6 bg-yellow-200"></div>
                    <div className="w-2/6 bg-green-200"></div>
                    <div className="w-1/6 bg-yellow-200"></div>
                    <div className="w-1/6 bg-red-200"></div>
                </div>
                <div className={`absolute w-3 h-3 rounded-full border-2 border-white shadow -translate-y-0.5 ${getZScoreColor(zScore?.value)}`} style={{ left: `calc(${getZScoreBar(zScore?.value)}% - 6px)` }}></div>
            </div>
            <span className="text-xs font-bold text-gray-700 w-10 text-right">{zScore?.value?.toFixed(1) || '-'}</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">Median: {median}{actual && ` | Aktual: ${actual}`}</p>
        {showStuntingWarning && (
            <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-[10px] text-red-600 font-medium">⚠️ Indikasi Stunting - Perlu perhatian khusus</p>
            </div>
        )}
    </div>
);

export default TumbuhKembangPage;
