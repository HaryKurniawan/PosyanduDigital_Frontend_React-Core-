import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileIncompleteModal = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Illustration */}
        <div className="mb-6">
          <svg
            className="w-40 h-40 mx-auto"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="80" fill="#E9D5FF" />
            <path
              d="M100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140Z"
              fill="#A855F7"
            />
            <circle cx="90" cy="95" r="8" fill="white" />
            <circle cx="110" cy="95" r="8" fill="white" />
            <path
              d="M85 110C85 110 90 120 100 120C110 120 115 110 115 110"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M70 80L75 75M130 80L125 75"
              stroke="#A855F7"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Lengkapi Data Keluarga
        </h2>
        <p className="text-gray-600 mb-8">
          Untuk melanjutkan, mohon lengkapi data keluarga Anda terlebih dahulu. Data ini penting untuk layanan posyandu.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate('/family-data-form')}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition duration-200 shadow-lg"
        >
          Isi Data Sekarang
        </button>
      </div>
    </div>
  );
};

export default ProfileIncompleteModal;
