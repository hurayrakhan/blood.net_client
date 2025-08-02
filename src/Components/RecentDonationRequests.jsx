import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import axiosSecure from '../api/axiosSecure';


const gradients = [
  'from-pink-100 via-red-100 to-yellow-100',
  'from-blue-100 via-purple-100 to-pink-100',
  'from-green-100 via-teal-100 to-blue-100',
  'from-yellow-100 via-orange-100 to-red-100'
];


const RecentDonationRequests = () => {
  const { data: donations, isLoading } = useQuery({
    queryKey: ['recentDonations'],
    queryFn: async () => {
      const res = await axiosSecure.get('/donations/recent/limit');
      return res.data; // ✅ return array directly
    },
  });


  return (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#E63946] mb-10">
        Recent Blood Donation Requests 🩸
      </h2>

      {isLoading ? (
        <p className="text-center text-[#E63946]">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {donations.map((req, index) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl p-5 text-gray-600 hover:transition-transform hover:transform shadow-lg bg-gradient-to-br ${gradients[index % gradients.length]}`}
            >
              <h3 className="text-lg text-black font-bold mb-2">{req.recipientName}</h3>
              <p className="text-sm">Blood Group: <span className="font-semibold">{req.bloodGroup}</span></p>
              <p className="text-sm">District: {req.district}</p>
              <p className="text-sm">Upazila: {req.upazila}</p>
              <div className="mt-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${req.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : req.status === 'fulfilled'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                  {req.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentDonationRequests;
