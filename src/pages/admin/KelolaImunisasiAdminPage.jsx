import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit2, Trash2, Syringe, AlertCircle, Save, X } from 'lucide-react';
import api from '../../services/api';

const KelolaImunisasiAdminPage = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  
  const [formData, setFormData] = useState({
    ageRange: '',
    ageInMonths: '',
    vaccines: []
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posyandu/immunization/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      alert('Gagal memuat data template imunisasi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        ageRange: template.ageRange,
        ageInMonths: template.ageInMonths,
        vaccines: template.vaccines.map(v => ({
          name: v.name,
          dose: v.dose,
          description: v.description,
          recommendedAge: v.recommendedAge
        }))
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        ageRange: '',
        ageInMonths: '',
        vaccines: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTemplate(null);
    setFormData({ ageRange: '', ageInMonths: '', vaccines: [] });
  };

  const handleAddVaccine = () => {
    setFormData({
      ...formData,
      vaccines: [
        ...formData.vaccines,
        { name: '', dose: '', description: '', recommendedAge: '' }
      ]
    });
  };

  const handleRemoveVaccine = (index) => {
    const newVaccines = formData.vaccines.filter((_, i) => i !== index);
    setFormData({ ...formData, vaccines: newVaccines });
  };

  const handleVaccineChange = (index, field, value) => {
    const newVaccines = [...formData.vaccines];
    newVaccines[index][field] = value;
    setFormData({ ...formData, vaccines: newVaccines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.vaccines.length === 0) {
      alert('Tambahkan minimal 1 vaksin');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        ageRange: formData.ageRange,
        ageInMonths: parseInt(formData.ageInMonths),
        vaccineList: formData.vaccines.map(v => ({
          nama: v.name,
          dosis: v.dose,
          keterangan: v.description,
          umur: v.recommendedAge
        }))
      };

      if (editingTemplate) {
        // Update not implemented yet in backend
        alert('Fitur update belum tersedia. Hapus dan buat ulang template.');
      } else {
        await api.post('/posyandu/immunization/template', payload);
        alert('Template berhasil ditambahkan!');
      }
      
      handleCloseModal();
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan template');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus template ini?')) return;
    
    try {
      setLoading(true);
      // Delete endpoint not in routes yet, you may need to add it
      alert('Fitur hapus belum tersedia di backend');
      // await api.delete(`/posyandu/immunization/template/${id}`);
      // alert('Template berhasil dihapus!');
      // fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Gagal menghapus template');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Kelola Data Imunisasi</h1>
              <p className="text-sm text-white/80 mt-1">Master data template imunisasi</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold hover:bg-purple-50 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            Tambah
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Informasi</p>
              <p className="text-sm text-blue-800">
                Data imunisasi ini akan digunakan sebagai pilihan saat input pemeriksaan anak.
                Setiap template berisi daftar vaksin yang sesuai dengan rentang usia tertentu.
              </p>
            </div>
          </div>
        </div>

        {/* Templates List */}
        {templates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Syringe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Belum ada template imunisasi</p>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold"
            >
              Tambah Template
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {template.ageRange}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Usia: {template.ageInMonths} bulan • {template.vaccines.length} vaksin
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(template)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {template.vaccines.map((vaccine) => (
                    <div
                      key={vaccine.id}
                      className="bg-gray-50 rounded-xl p-3 border border-gray-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {vaccine.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {vaccine.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">
                              Dosis {vaccine.dose}
                            </span>
                            <span className="text-xs text-gray-500">
                              Usia: {vaccine.recommendedAge}
                            </span>
                          </div>
                        </div>
                        <Syringe className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingTemplate ? 'Edit Template' : 'Tambah Template Baru'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-white/20 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Template Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rentang Usia *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 0-1 Bulan"
                    value={formData.ageRange}
                    onChange={(e) => setFormData({...formData, ageRange: e.target.value})}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Usia (Bulan) *
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.ageInMonths}
                    onChange={(e) => setFormData({...formData, ageInMonths: e.target.value})}
                    required
                    min="0"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Vaccines List */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Daftar Vaksin
                  </label>
                  <button
                    type="button"
                    onClick={handleAddVaccine}
                    className="flex items-center gap-1 text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-200 transition font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Vaksin
                  </button>
                </div>

                {formData.vaccines.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <Syringe className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Belum ada vaksin</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.vaccines.map((vaccine, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-semibold text-gray-700">
                            Vaksin #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveVaccine(index)}
                            className="text-red-600 hover:bg-red-100 p-1 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <input
                              type="text"
                              placeholder="Nama Vaksin"
                              value={vaccine.name}
                              onChange={(e) => handleVaccineChange(index, 'name', e.target.value)}
                              required
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Dosis"
                            value={vaccine.dose}
                            onChange={(e) => handleVaccineChange(index, 'dose', e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Usia Rekomendasi"
                            value={vaccine.recommendedAge}
                            onChange={(e) => handleVaccineChange(index, 'recommendedAge', e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                          <div className="col-span-2">
                            <textarea
                              placeholder="Deskripsi vaksin"
                              value={vaccine.description}
                              onChange={(e) => handleVaccineChange(index, 'description', e.target.value)}
                              required
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold disabled:bg-gray-300 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Menyimpan...' : 'Simpan Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaImunisasiAdminPage;