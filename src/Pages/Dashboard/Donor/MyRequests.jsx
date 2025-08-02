import { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../../Providers/AuthProvider';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import EditDonationModal from '../../../Components/Modals/EditMyRequest';
import axiosSecure from '../../../api/axiosSecure';
import { Helmet } from 'react-helmet-async';

export default function MyRequests() {
  const { user } = useContext(AuthContext);
  const [editingDonation, setEditingDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data = {}, refetch, isLoading } = useQuery({
    queryKey: ['myDonationRequests', user?.email, searchTerm, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donations/user?email=${user?.email}&search=${searchTerm}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const requests = data.requests || [];
  const total = data.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to recover this request!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E63946',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      await axiosSecure.delete(`/donations/${id}`);
      refetch();
      Swal.fire('Deleted!', 'Your request has been removed.', 'success');
    }
  };

  return (
    <motion.div
      className="p-4 md:p-8 bg-white rounded-2xl shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >

      <Helmet>
        <title>Blood.net | My Donation Requests</title>
        <meta name="description" content="View and manage your donation requests on Blood.net." />
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
        <h2 className="text-2xl font-bold text-[#E63946]">📋 My Donation Requests</h2>
        <input
          type="text"
          placeholder="Search by blood group or location..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 px-3 py-2 rounded w-full md:w-1/3"
        />
      </div>

      {isLoading ? (
        <div className="text-center text-[#E63946] font-semibold py-10">
          Loading your requests...
        </div>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">You haven’t made any requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-[#FFEDEE] text-[#A4161A] text-left">
                <th className="p-3">#</th>
                <th className="p-3">Blood Group</th>
                <th className="p-3">Location</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <motion.tr
                  key={req._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-[#fef3f3] transition"
                >
                  <td className="p-3">{(page - 1) * limit + index + 1}</td>
                  <td className="p-3 font-medium">{req.bloodGroup}</td>
                  <td className="p-3">
                    {req.district}, {req.upazila}
                  </td>
                  <td className="p-3">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${req.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : req.status === 'fulfilled'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      title="Edit"
                      className={`text-blue-600 hover:text-blue-800 ${req.status === 'fulfilled' ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      onClick={() => {
                        if (req.status !== 'fulfilled') {
                          setEditingDonation(req);
                          setIsModalOpen(true);
                        }
                      }}
                      disabled={req.status === 'fulfilled'}
                    >
                      <FaEdit />
                    </button>
                    <button
                      title="Delete"
                      className={`text-[#E63946] hover:text-[#A4161A] ${req.status === 'fulfilled' ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      onClick={() => {
                        if (req.status !== 'fulfilled') handleDelete(req._id);
                      }}
                      disabled={req.status === 'fulfilled'}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm bg-[#E63946] text-white rounded hover:bg-[#A4161A] disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 text-sm bg-[#E63946] text-white rounded hover:bg-[#A4161A] disabled:opacity-50"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {editingDonation && (
        <EditDonationModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          donation={editingDonation}
          refetch={refetch}
        />
      )}
    </motion.div>
  );
}
