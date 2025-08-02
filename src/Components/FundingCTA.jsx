// components/FundingCTA.jsx
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../../public/Donaciones.json';
import { Fade } from 'react-awesome-reveal';

export default function FundingCTA() {
  const navigate = useNavigate();

  return (
    <Fade>
      <div className="w-10/12 mx-auto bg-gradient-to-r from-red-100 via-white to-red-100 px-4 md:px-8 rounded-3xl shadow-xl my-12">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Lottie Animation */}
          <div className="w-full md:w-1/3">
            <Lottie animationData={animationData} loop autoplay />
          </div>

          {/* Text Content */}
          <div className="w-full md:w-2/3 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E63946] mb-4">
              Support Our Mission ❤️
            </h2>
            <p className="text-gray-700 mb-6 max-w-xl">
              Help us keep Blood.net running and save more lives. Your donations fund life-saving technology, outreach, and support for blood seekers and donors.
            </p>
            <button
              onClick={() => navigate('/funding')}
              className="bg-[#E63946] hover:bg-[#A4161A] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
            >
              Donate Fund
            </button>
          </div>
        </div>
      </div>
    </Fade>
  );
}
