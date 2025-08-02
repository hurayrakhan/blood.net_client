// components/home/StatisticsSection.jsx
import { useQuery } from '@tanstack/react-query';
import CountUp from 'react-countup';
import { Fade } from 'react-awesome-reveal';
import { FaUsers, FaHandHoldingHeart, FaTint, FaDollarSign, FaHandsHelping } from 'react-icons/fa';
import axiosSecure from '../api/axiosSecure';

const statsConfig = [
  { label: 'Total Donors', icon: <FaUsers className="text-3xl" />, key: 'totalUsers' },
  { label: 'Total Requests', icon: <FaTint className="text-3xl" />, key: 'totalRequests' },
  { label: 'Successful Donations', icon: <FaHandHoldingHeart className="text-3xl" />, key: 'successfulRequests' },
  { label: 'Total Fundings', icon: <FaDollarSign className="text-3xl" />, key: 'totalFunding' },
  { label: 'Partner Organizations', icon: <FaHandsHelping className="text-3xl" />, key: 'static', value: 12 },
];

const gradients = [
  'from-pink-100 via-red-100 to-yellow-100',
  'from-blue-100 via-purple-100 to-pink-100',
  'from-green-100 via-teal-100 to-blue-100',
  'from-yellow-100 via-orange-100 to-red-100',
  'from-sky-100 via-blue-100 to-emerald-100',
];

export default function StatisticsSection() {
  const { data: statistics = {}, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      const res = await axiosSecure.get('/public/stats');
      return res.data;
    },
  });

  return (
    <section className="py-16 bg-[#FFF8F8]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <Fade cascade>
          <h2 className="text-4xl font-bold text-[#E63946] mb-6">Our Impact in Numbers</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Every number represents a life changed. Thank you for being a part of our journey.
          </p>
        </Fade>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {statsConfig.map((stat, index) => (
            <Fade direction="up" delay={index * 100} key={stat.key}>
              <div
                className={`rounded-2xl p-6 shadow-md hover:shadow-2xl bg-gradient-to-br ${gradients[index]} transition-all duration-300`}
              >
                <div className="text-[#E63946] mb-2">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-gray-800">
                  {isLoading && stat.key !== 'static'
                    ? '...'
                    : <CountUp end={stat.key === 'static' ? stat.value : statistics[stat.key] || 0} duration={2} />}
                </h3>
                <p className="text-gray-700 mt-2 font-medium">{stat.label}</p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}
