import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  saveMotherData,
  saveSpouseData,
  saveChildData,
  completeProfile,
  getFamilyData
} from '../services/familyDataService';

const FamilyDataFormPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ibu');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  // Mother Data
  const [motherData, setMotherData] = useState({
    fullName: '',
    phoneNumber: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    education: '',
    occupation: '',
    bloodType: '',
    jkn: '',
    facilityTK1: ''
  });

  // Spouse Data
  const [spouseData, setSpouseData] = useState({
    fullName: '',
    nik: '',
    occupation: '',
    phoneNumber: ''
  });

  // Children Data
  const [childrenData, setChildrenData] = useState([
    {
      fullName: '',
      nik: '',
      birthCertificate: '',
      childOrder: 1,
      bloodType: '',
      gender: 'L', // Default Laki-laki
      birthPlace: '',
      birthDate: ''
    }
  ]);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const data = await getFamilyData();

      if (data.motherData) {
        setMotherData({
          fullName: data.motherData.fullName || '',
          phoneNumber: data.motherData.phoneNumber || '',
          nik: data.motherData.nik || '',
          birthPlace: data.motherData.birthPlace || '',
          birthDate: data.motherData.birthDate ? data.motherData.birthDate.split('T')[0] : '',
          education: data.motherData.education || '',
          occupation: data.motherData.occupation || '',
          bloodType: data.motherData.bloodType || '',
          jkn: data.motherData.jkn || '',
          facilityTK1: data.motherData.facilityTK1 || ''
        });
      }

      if (data.spouseData) {
        setSpouseData({
          fullName: data.spouseData.fullName || '',
          nik: data.spouseData.nik || '',
          occupation: data.spouseData.occupation || '',
          phoneNumber: data.spouseData.phoneNumber || ''
        });
      }

      if (data.childrenData && data.childrenData.length > 0) {
        setChildrenData(data.childrenData.map(child => ({
          fullName: child.fullName || '',
          nik: child.nik || '',
          birthCertificate: child.birthCertificate || '',
          childOrder: child.childOrder || 1,
          bloodType: child.bloodType || '',
          gender: child.gender || 'L',
          birthPlace: child.birthPlace || '',
          birthDate: child.birthDate ? child.birthDate.split('T')[0] : ''
        })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Validasi data ibu
  const validateMotherData = () => {
    const emptyFields = [];
    Object.keys(motherData).forEach(key => {
      if (!motherData[key] || motherData[key].trim() === '') {
        emptyFields.push(key);
      }
    });
    return emptyFields;
  };

  // Validasi data suami
  const validateSpouseData = () => {
    const emptyFields = [];
    Object.keys(spouseData).forEach(key => {
      if (!spouseData[key] || spouseData[key].trim() === '') {
        emptyFields.push(key);
      }
    });
    return emptyFields;
  };

  // Validasi data anak
  const validateChildrenData = () => {
    const emptyFields = [];
    childrenData.forEach((child, index) => {
      Object.keys(child).forEach(key => {
        if (!child[key] || child[key].toString().trim() === '') {
          emptyFields.push(`Anak ke-${index + 1}: ${key}`);
        }
      });
    });
    return emptyFields;
  };

  // Fungsi untuk pindah tab dengan validasi
  const handleTabChange = (newTab) => {
    // Cek tab sekarang sebelum pindah
    if (activeTab === 'ibu') {
      const emptyFields = validateMotherData();
      if (emptyFields.length > 0) {
        alert('Mohon lengkapi semua data Ibu terlebih dahulu!');
        return;
      }
    } else if (activeTab === 'suami') {
      const emptyFields = validateSpouseData();
      if (emptyFields.length > 0) {
        alert('Mohon lengkapi semua data Suami/Keluarga terlebih dahulu!');
        return;
      }
    } else if (activeTab === 'anak') {
      const emptyFields = validateChildrenData();
      if (emptyFields.length > 0) {
        alert('Mohon lengkapi semua data Anak terlebih dahulu!');
        return;
      }
    }

    // Jika validasi lolos, pindah tab
    setActiveTab(newTab);
  };

  const handleMotherChange = (e) => {
    setMotherData({ ...motherData, [e.target.name]: e.target.value });
  };

  const handleSpouseChange = (e) => {
    setSpouseData({ ...spouseData, [e.target.name]: e.target.value });
  };

  const handleChildChange = (index, e) => {
    const newChildren = [...childrenData];
    newChildren[index][e.target.name] = e.target.value;
    setChildrenData(newChildren);
  };

  const addChild = () => {
    setChildrenData([
      ...childrenData,
      {
        fullName: '',
        nik: '',
        birthCertificate: '',
        childOrder: childrenData.length + 1,
        bloodType: '',
        gender: 'L',
        birthPlace: '',
        birthDate: ''
      }
    ]);
  };

  const removeChild = (index) => {
    if (childrenData.length > 1) {
      const newChildren = childrenData.filter((_, i) => i !== index);
      setChildrenData(newChildren);
    }
  };

  const handleSubmit = async () => {
    // Validasi semua data sebelum submit
    const motherErrors = validateMotherData();
    const spouseErrors = validateSpouseData();
    const childErrors = validateChildrenData();

    if (motherErrors.length > 0 || spouseErrors.length > 0 || childErrors.length > 0) {
      alert('Mohon lengkapi semua data di semua tab terlebih dahulu!');
      return;
    }

    setLoading(true);
    try {
      await saveMotherData(motherData);
      await saveSpouseData(spouseData);
      await saveChildData({ children: childrenData });
      await completeProfile();

      alert('Data berhasil disimpan!');
      navigate('/home');
    } catch (error) {
      alert('Gagal menyimpan data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <h1 className="text-2xl font-bold text-center">Pengisian Data</h1>
            <p className="text-center text-sm mt-2 text-purple-100">
              Semua field wajib diisi sebelum melanjutkan
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => handleTabChange('ibu')}
              className={`flex-1 py-4 px-6 font-medium transition ${activeTab === 'ibu'
                ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Ibu
            </button>
            <button
              onClick={() => handleTabChange('suami')}
              className={`flex-1 py-4 px-6 font-medium transition ${activeTab === 'suami'
                ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Suami/Keluarga
            </button>
            <button
              onClick={() => handleTabChange('anak')}
              className={`flex-1 py-4 px-6 font-medium transition ${activeTab === 'anak'
                ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Anak
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {/* Tab Ibu */}
            {activeTab === 'ibu' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={motherData.fullName}
                    onChange={handleMotherChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ibu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIK <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nik"
                    value={motherData.nik}
                    onChange={handleMotherChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="3201234567890123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempat Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={motherData.birthPlace}
                    onChange={handleMotherChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Bandung"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={motherData.birthDate}
                    onChange={handleMotherChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pendidikan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={motherData.education}
                    onChange={handleMotherChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="SMA/Diploma/S1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pekerjaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={motherData.occupation}
                    onChange={handleMotherChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ibu Rumah Tangga/Pegawai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Golongan Darah <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodType"
                    value={motherData.bloodType}
                    onChange={handleMotherChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    <option value="">Pilih Golongan Darah</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. JKN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jkn"
                    value={motherData.jkn}
                    onChange={handleMotherChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0001234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faskes TK1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="facilityTK1"
                    value={motherData.facilityTK1}
                    onChange={handleMotherChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Puskesmas/Klinik"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={motherData.phoneNumber}
                    onChange={handleMotherChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+62 812 3456 7890"
                  />
                </div>
              </div>
            )}

            {/* Tab Suami/Keluarga */}
            {activeTab === 'suami' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={spouseData.fullName}
                    onChange={handleSpouseChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nama Suami/Keluarga"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIK <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nik"
                    value={spouseData.nik}
                    onChange={handleSpouseChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="3201234567890123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pekerjaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={spouseData.occupation}
                    onChange={handleSpouseChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Pekerjaan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={spouseData.phoneNumber}
                    onChange={handleSpouseChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+62 812 3456 7890"
                  />
                </div>
              </div>
            )}

            {/* Tab Anak */}
            {activeTab === 'anak' && (
              <div className="space-y-6">
                {childrenData.map((child, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-700">Anak ke-{index + 1}</h3>
                      {childrenData.length > 1 && (
                        <button
                          onClick={() => removeChild(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Hapus
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={child.fullName}
                        onChange={(e) => handleChildChange(index, e)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Nama Anak"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIK <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nik"
                        value={child.nik}
                        onChange={(e) => handleChildChange(index, e)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="3201234567890123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        No. Akte Kelahiran <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="birthCertificate"
                        value={child.birthCertificate}
                        onChange={(e) => handleChildChange(index, e)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="A17980123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Anak ke <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="childOrder"
                        value={child.childOrder}
                        onChange={(e) => handleChildChange(index, e)}
                        required
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Golongan Darah <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="bloodType"
                        value={child.bloodType}
                        onChange={(e) => handleChildChange(index, e)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      >
                        <option value="">Pilih Golongan Darah</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={child.gender}
                        onChange={(e) => handleChildChange(index, e)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tempat Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="birthPlace"
                        value={child.birthPlace}
                        onChange={(e) => handleChildChange(index, e)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Bandung"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={child.birthDate}
                        onChange={(e) => handleChildChange(index, e)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addChild}
                  className="w-full py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition font-medium"
                >
                  + Tambah data anak lebih dari satu
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="p-6 bg-gray-50 border-t">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Menyimpan...' : 'Simpan Semua Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyDataFormPage;