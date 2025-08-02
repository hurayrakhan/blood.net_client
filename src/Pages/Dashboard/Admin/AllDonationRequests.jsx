import { useQuery } from '@tanstack/react-query';
import { useState, useContext } from 'react';
import axiosSecure from '../../../api/axiosSecure';
import Swal from 'sweetalert2';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../../Providers/AuthProvider';
import { Helmet } from 'react-helmet-async';

const AllDonationRequestsPage = () => {
  const { userRole } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('desc');
  const limit = 10;

  const {
    data: requestsData = { requests: [], total: 0 },
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['donationRequests', page, search, statusFilter, sort],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/admin/donations?page=${page}&limit=${limit}&search=${search}&status=${statusFilter}&sort=${sort}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(requestsData.total / limit);

  const handleStatusUpdate = async (id, newStatus) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to mark this request as ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#E63946',
      confirmButtonText: 'Yes, Update',
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/donations/${id}`, {
          status: newStatus,
        });
        if (res.data.modifiedCount > 0) {
          Swal.fire('Updated!', 'Status updated successfully.', 'success');
          refetch();
        }
      } catch (err) {
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">

      <Helmet>
        <title>Blood.net | All Donation Requests</title>
        <meta name="description" content="View and manage all blood donation requests on Blood.net." />
      </Helmet>
      <h2 className="text-2xl font-bold text-[#E63946] mb-6 border-b pb-2">
        All Blood Donation Requests
      </h2>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search by district or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full max-w-xs"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded ml-auto"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center text-[#E63946] py-10">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded">
            <thead className="bg-[#FFEDEE] text-[#A4161A] text-sm">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Blood Group</th>
                <th className="p-3 text-left">Recipient</th>
                <th className="p-3 text-left">District</th>
                <th className="p-3 text-left">Upazila</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {requestsData.requests.length > 0 ? (
                requestsData.requests.map((req, i) => (
                  <tr key={req._id} className="border-t hover:bg-[#FFF6F6]">
                    <td className="p-3">{(page - 1) * limit + i + 1}</td>
                    <td className="p-3 font-semibold">{req.bloodGroup}</td>
                    <td className="p-3">{req.recipientName}</td>
                    <td className="p-3">{req.district}</td>
                    <td className="p-3">{req.upazila}</td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${req.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : req.status === 'fulfilled'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        disabled={req.status === 'fulfilled' || userRole === 'admin' || userRole === 'volunteer' ? false : true}
                        onClick={() => handleStatusUpdate(req._id, 'fulfilled')}
                        className={`text-green-600 hover:text-green-800 ${req.status === 'fulfilled' || (userRole !== 'admin' && userRole !== 'volunteer') ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                      >
                        <FaCheck />
                      </button>
                      <button
                        disabled={req.status === 'fulfilled' || userRole !== 'admin'}
                        onClick={() => handleStatusUpdate(req._id, 'cancelled')}
                        className={`text-red-600 hover:text-red-800 ${req.status === 'fulfilled' || userRole !== 'admin' ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-6">
                    No donation requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end gap-3 p-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded text-white font-medium ${page === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#E63946] hover:bg-[#A4161A]'
                }`}
            >
              Prev
            </button>
            <span className="flex items-center">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded text-white font-medium ${page === totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#E63946] hover:bg-[#A4161A]'
                }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDonationRequestsPage;
