import React, { useContext, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Providers/AuthProvider';
import axiosSecure from '../../api/axiosSecure';
import { motion } from 'framer-motion';
import { Fade } from 'react-awesome-reveal';
import { Dialog } from '@headlessui/react';
import Lottie from 'lottie-react';
import thankYouAnimation from '../../../public/Thank You!.json'; // Your animation file
import { Helmet } from 'react-helmet-async';

export default function AllRequests() {
  const { user, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const limit = 6;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['public-donations', search, filterGroup, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donations?search=${encodeURIComponent(search)}&bloodGroup=${encodeURIComponent(filterGroup)}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });

  const requests = data?.data || [];
  const totalPages = Math.ceil((data?.count || 1) / limit);

  const fulfillDonation = useMutation({
    mutationFn: async ({ requestId }) => {
      return await axiosSecure.patch(`/donations/${requestId}`, {
        status: 'fulfilled',
        donatedBy: {
          email: user.email,
          name: user.displayName,
          avatar: user.photoURL || '',
        },
      });
    },
    onSuccess: () => {
      setShowModal(false);
      setShowThankYou(true);
      refetch();
      setTimeout(() => setShowThankYou(false), 3000);
    },
    onError: () => {
      Swal.fire('Error', 'Failed to update donation status', 'error');
    },
  });

  const handleDonateClick = (request) => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Please login to donate',
        confirmButtonColor: '#E63946',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Login Now',
      }).then((res) => {
        if (res.isConfirmed) navigate('/login');
      });
      return;
    }

    if (userRole !== 'donor' && userRole !== 'volunteer') {
      Swal.fire({
        icon: 'info',
        title: 'Only donors or volunteers can donate!',
        text: 'Please switch to a valid account.',
      });
      return;
    }

    if (request.status === 'fulfilled') {
      Swal.fire('Info', 'This request is already fulfilled.', 'info');
      return;
    }

    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleConfirmDonate = () => {
    fulfillDonation.mutate({ requestId: selectedRequest._id });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      <Helmet>
        <title>Blood.net | All Donation Requests</title>
        <meta name="description" content="Browse all current blood donation requests. Step forward to help someone in need today." />
      </Helmet>

      {/* Header */}
      <Fade direction="up" triggerOnce>
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-[#E63946] mb-2">All Blood Donation Requests</h2>
          <p className="text-gray-600">Help save lives by donating blood today.</p>
        </div>
      </Fade>

      {/* Filters */}
      <Fade direction="up" triggerOnce>
        <div className="mb-8 flex flex-col md:flex-row justify-center gap-4 items-center">
          <input
            type="text"
            placeholder="Search by location or name"
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded shadow-sm"
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="">All Blood Groups</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
      </Fade>

      {/* Requests Grid */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">No donation requests found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req, index) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative border border-gray-200 rounded-lg p-5 shadow hover:shadow-lg transition bg-white"
            >
              {/* Status Badge */}
              <span
                className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-semibold ${req.status === 'fulfilled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}
              >
                {req.status || 'pending'}
              </span>

              <h4 className="text-xl font-semibold text-[#E63946] mb-2">{req.recipientName}</h4>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Blood Group:</strong> {req.bloodGroup}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>District:</strong> {req.district}, {req.upazila}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Hospital:</strong> {req.hospitalName}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Time:</strong> {req.donationDate} at {req.donationTime}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Request By:</strong> {req.requesterName}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Message:</strong> {req.requestMessage?.slice(0, 70)}...
              </p>

              <button
                onClick={() => handleDonateClick(req)}
                className="w-full bg-[#E63946] text-white py-2 rounded hover:bg-red-600 transition font-semibold"
              >
                Donate Now
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Fade direction="up" triggerOnce>
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded font-medium text-sm ${page === i + 1 ? 'bg-[#E63946] text-white' : 'bg-white text-[#E63946] border-[#E63946]'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </Fade>
      )}

      {/* Confirmation Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen bg-black/40 px-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <Dialog.Title className="text-xl font-bold text-[#E63946] mb-4">Confirm Donation</Dialog.Title>
            <div className="text-sm space-y-2 text-gray-700">
              <p>
                <strong>Patient:</strong> {selectedRequest?.recipientName}
              </p>
              <p>
                <strong>Blood Group:</strong> {selectedRequest?.bloodGroup}
              </p>
              <p>
                <strong>Location:</strong> {selectedRequest?.district}, {selectedRequest?.upazila}
              </p>
              <p>
                <strong>Hospital:</strong> {selectedRequest?.hospitalName}
              </p>
              <hr className="my-2" />
              <p>
                <strong>Your Name:</strong> {user?.displayName}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleConfirmDonate} className="px-4 py-2 bg-[#E63946] text-white rounded hover:bg-red-700">
                Confirm Donation
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Thank You Animation */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <Lottie animationData={thankYouAnimation} loop={false} />
            <p className="text-center text-lg font-semibold text-[#E63946] mt-2">Thank you for donating! ❤️</p>
          </div>
        </div>
      )}
    </section>
  );
}
