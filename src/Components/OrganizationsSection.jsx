// components/home/OrganizationsSection.jsx
import Marquee from 'react-fast-marquee';
import { Fade } from 'react-awesome-reveal';

const organizations = [
  {
    name: 'Red Crescent Society',
    logo: 'https://i.ibb.co/Kp8RQNB2/Bangladesh-Red-Crescent-Society-Logo-svg.png',
    url: 'https://www.ifrc.org/',
  },
  {
    name: 'Red Cross International',
    logo: 'https://i.ibb.co/wFWLFMmY/image-1.png',
    url: 'https://www.redcross.org/',
  },
  {
    name: 'Blood Donors Bangladesh',
    logo: 'https://i.ibb.co/xtV9kWgf/images.png',
    url: 'https://blooddonorsbd.com/',
  },
  {
    name: 'Badhan Foundation',
    logo: 'https://i.ibb.co/bMVrP9tW/unnamed.png',
    url: 'https://www.badhan.org/',
  },
  {
    name: 'Sandhani',
    logo: 'https://i.ibb.co/dwKd3X8x/images-1.png',
    url: 'https://sandhani.org/',
  },
  {
    name: 'Quantum Foundation',
    logo: 'https://i.ibb.co/gMMgyQJS/quantum-foundation-logo.png',
    url: 'https://quantummethod.org.bd/',
  },
  {
    name: 'Obhizatrik Foundation',
    logo: 'https://i.ibb.co/6cLZ0dWk/int-logo.webp',
    url: 'https://obhizatrik.org/',
  },
];

export default function OrganizationsSection() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className=" mx-auto px-4 text-center">
        <Fade cascade>
          <h2 className="text-4xl font-bold text-[#E63946] mb-4">
            Organizations We Work With 🤝
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            We proudly partner with impactful organizations to save more lives together.
          </p>
        </Fade>

        <Fade delay={300} triggerOnce>
          <Marquee pauseOnHover speed={30} gradient={false}>
            {organizations.map((org, i) => (
              <a
                key={i}
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FFF8F8] mx-4 w-[180px] sm:w-[200px] rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center p-4"
              >
                <img
                  src={org.logo}
                  alt={org.name}
                  className="h-16 sm:h-20 object-contain mb-3"
                />
                <p className="text-sm font-medium text-[#1D1D1D] text-center leading-tight">
                  {org.name}
                </p>
              </a>
            ))}
          </Marquee>
        </Fade>
      </div>
    </section>
  );
}
