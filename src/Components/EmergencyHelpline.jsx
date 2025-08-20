import { PhoneCall } from "lucide-react";
import { Fade } from "react-awesome-reveal";

const EmergencyHelpline = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <Fade cascade>
          <div>
            <h2 className="text-4xl font-bold text-[#E63946] mb-6">
              Emergency Helpline
            </h2>
            <p className="text-gray-600 mb-6">
              In case of urgent need, you can reach us anytime. Our helpline 
              connects you instantly with nearby blood donors and hospitals. 
              We’re here to support you 24/7.
            </p>
          </div>
        </Fade>

        {/* Right Call Card */}
        <div className="bg-gray-50 border-l-4 border-[#E63946] rounded-2xl shadow-md p-10 text-center">
          <PhoneCall size={40} className="mx-auto text-[#E63946] mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            24/7 Helpline
          </h3>
          <p className="text-[#E63946] text-3xl font-bold mb-4">
            +880 1234-56789
          </p>
          <a
            href="tel:+880123456789"
            className="inline-block px-6 py-3 bg-[#E63946] text-white rounded-xl hover:bg-[#A4161A] transition font-medium"
          >
            Call Now
          </a>
        </div>

      </div>
    </section>
  );
};

export default EmergencyHelpline;
