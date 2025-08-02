import { useQuery } from '@tanstack/react-query';
import { useState, useContext } from 'react';
import axiosSecure from '../../../api/axiosSecure';
import { AuthContext } from '../../../Providers/AuthProvider';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const VolunteerDashboardHome = () => {
  const { userRole } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const limit = 5;

  const {
    data: requestsData = {},
    isLoading: requestsLoading,
    refetch,
  } = useQuery({
    queryKey: ['volunteerDonations', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/volunteer/donations?limit=${limit}&page=${page}&sort=desc`);
      return res.data;
    },
    enabled: userRole === 'volunteer',
  });

  const totalPages = Math.ceil((requestsData.count || 0) / limit);

  const updateStatus = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to mark this request as fulfilled.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E63946',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, mark fulfilled!'
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/volunteer/donations/${id}`, { status: 'fulfilled' });
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Donation status updated to fulfilled.',
          timer: 2000,
          showConfirmButton: false
        });
        refetch(); // Refetch updated data
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to update donation status.',
        });
      }
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="pb-4 mb-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-[#E63946]">Volunteer Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage donation requests and help save lives.</p>
      </div>

      {requestsLoading ? (
        <div className="text-center py-20 text-[#E63946] font-semibold text-lg">
          Loading dashboard data...
        </div>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-[#E63946] mb-4">Recent Donation Requests</h2>
          {requestsData.donations && requestsData.donations.length > 0 ? (
            <motion.div
              className="overflow-x-auto rounded-lg border border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-[#FFEDEE] text-[#A4161A] text-left text-sm font-semibold">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Blood Group</th>
                    <th className="p-3">Recipient</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsData.donations.map((req, i) => (
                    <motion.tr
                      key={req._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b hover:bg-[#fef3f3] transition"
                    >
                      <td className="p-3">{(page - 1) * limit + i + 1}</td>
                      <td className="p-3 font-semibold">{req.bloodGroup}</td>
                      <td className="p-3">{req.recipientName}</td>
                      <td className="p-3">{req.recipientDistrict}, {req.recipientUpazila}</td>
                      <td className="p-3">{new Date(req.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="p-3">
                        {req.status !== 'fulfilled' ? (
                          <button
                            onClick={() => updateStatus(req._id)}
                            className="bg-[#E63946] text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          >
                            Mark Fulfilled
                          </button>
                        ) : (
                          <span className="text-green-700 font-semibold">Completed</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              <PaginationControls page={page} setPage={setPage} totalPages={totalPages} />
            </motion.div>
          ) : (
            <p className="text-gray-600">No donation requests found.</p>
          )}
        </motion.section>
      )}
    </div>
  );
};

function StatusBadge({ status }) {
  const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase";
  switch (status) {
    case 'pending':
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>Pending</span>;
    case 'fulfilled':
      return <span className={`${baseClasses} bg-green-100 text-green-700`}>Fulfilled</span>;
    case 'cancelled':
      return <span className={`${baseClasses} bg-red-100 text-red-700`}>Cancelled</span>;
    default:
      return <span className={`${baseClasses} bg-gray-200 text-gray-600`}>Unknown</span>;
  }
}

function PaginationControls({ page, setPage, totalPages }) {
  return (
    <div className="flex justify-end gap-3 p-4">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className={`px-4 py-2 rounded-md font-semibold text-white ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#E63946] hover:bg-[#A4161A]'}`}
      >
        Previous
      </button>
      <span className="flex items-center text-sm font-medium">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className={`px-4 py-2 rounded-md font-semibold text-white ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#E63946] hover:bg-[#A4161A]'}`}
      >
        Next
      </button>
    </div>
  );
}

export default VolunteerDashboardHome;
