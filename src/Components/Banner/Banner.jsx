// components/home/HeroSection.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { AuthContext } from '../../Providers/AuthProvider';
import animationData from '../../../public/blood donner.json';
import { Fade } from 'react-awesome-reveal';

export default function Banner() {
  const { user } = useContext(AuthContext);

  return (
    <section className="bg-white py-8">
      <div className="w-10/12 mx-auto flex flex-col-reverse md:flex-row items-center justify-between  gap-10">
        
        {/* Text Content */}
        <Fade direction="left" cascade>
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-[#E63946] leading-tight">
              Donate Blood, Save Lives ❤️
            </h1>
            <p className="text-gray-600 text-lg max-w-lg">
              Join our life-saving mission today. Step forward and be a silent hero. Your donation today could be someone’s miracle tomorrow. Be the reason someone lives another day.
            </p>

            {user ? (
              <Link to="/dashboard" className="inline-block bg-[#E63946] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A4161A] transition">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" className="inline-block bg-[#E63946] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A4161A] transition">
                Be a Donor
              </Link>
            )}
          </div>
        </Fade>

        {/* Lottie Animation */}
        <Fade direction="right">
          <div className="flex-1">
            <Lottie animationData={animationData} loop={true} />
          </div>
        </Fade>
      </div>
    </section>
  );
}
