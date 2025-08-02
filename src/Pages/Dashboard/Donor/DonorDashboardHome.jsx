import { use, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaTint, FaMapMarkerAlt, FaClock, FaHandHoldingHeart } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axiosSecure from '../../../api/axiosSecure';
import { AuthContext } from '../../../Providers/AuthProvider';
import { Link } from 'react-router-dom';



export default function DonorDashboard() {
  const { user } = useContext(AuthContext);

  const { data: donations = [], isLoading, isError } = useQuery({
    queryKey: ['recentDonations', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/donations/recent');
      return res.data;
    },
    enabled: !!user?.email,
  });
  

  return (
    <motion.div
      className="p-5 md:p-10 bg-white shadow-md rounded-2xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ✅ Always visible Welcome Section */}
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-bold text-[#E63946]">
          👋 Welcome back, <span className="text-[#A4161A]">{user?.displayName || 'Donor'}</span>!
        </h2>
        <p className="text-base text-[#1D1D1D] mt-2">
          Here’s a quick look at your recent donation activity.
        </p>
      </div>

      {/* ✅ Total Count Card - even before loading completes */}
      <motion.div
        className="bg-[#FFEDEE] border border-[#E63946]/40 text-[#A4161A] rounded-xl p-5 mb-8 flex items-center gap-4 shadow-sm"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <FaHandHoldingHeart className="text-3xl" />
        <div>
          <p className="text-sm font-medium text-[#1D1D1D]">Total Donation Requests</p>
          <h3 className="text-2xl font-bold">
            {isLoading ? '...' : donations.length}
          </h3>
        </div>
      </motion.div>

      {/* ✅ Recent Donations */}
      <h3 className="text-xl font-semibold text-[#1D1D1D] mb-4">
        🩸 Your 3 Most Recent Donation Requests
      </h3>

      {/* Error Handling */}
      {isError && (
        <p className="text-red-500 text-sm mb-4">
          ❌ Failed to load your donation data.
        </p>
      )}

      {/* Loading Spinner for Recent Donations */}
      {isLoading ? (
        <p className="text-gray-500">Loading recent donation requests...</p>
      ) : donations.length === 0 ? (
        <p className="text-gray-600">You haven’t made any donation requests yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {donations.map((donation, idx) => (
            <motion.div
              key={idx}
              className="bg-[#F1FAEE] p-4 rounded-xl border border-[#E63946]/20 hover:shadow-lg transition"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-2 text-[#E63946] mb-2 font-medium">
                <FaTint /> {donation.bloodGroup}
              </div>

              <div className="text-sm text-[#1D1D1D] flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#A4161A]" />
                {donation.district}, {donation.upazila}
              </div>

              <div className="text-sm text-[#1D1D1D] flex items-center gap-2 mt-1">
                <FaClock className="text-[#A4161A]" />
                Requested on:{' '}
                {new Date(donation.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Button */}
      {!isLoading && donations.length > 0 && (
        <div className="mt-6 text-right">
          <Link
            to="/dashboard/myRequests"
            className="inline-block bg-[#E63946] text-white px-5 py-2 rounded-md font-medium hover:bg-[#A4161A] transition"
          >
            See All Requests →
          </Link>
        </div>
      )}
    </motion.div>
  );
}
