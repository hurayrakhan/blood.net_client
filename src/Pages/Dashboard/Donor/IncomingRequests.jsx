import { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../../Providers/AuthProvider';
import axiosSecure from '../../../api/axiosSecure';
import Swal from 'sweetalert2';
import { Dialog } from '@headlessui/react';
import { Helmet } from 'react-helmet-async';

const IncomingRequests = () => {
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const limit = 5;

  const { data = { requests: [], total: 0 }, refetch, isLoading } = useQuery({
    queryKey: ['incomingRequests', user?.email, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donations/incoming?email=${user.email}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const totalPages = Math.ceil(data.total / limit);

  const handleStatusUpdate = async (id, newStatus) => {
    const result = await Swal.fire({
      title: `Mark as ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (result.isConfirmed) {
      const res = await axiosSecure.patch(`/donations/${id}`, { status: newStatus });
      if (res.status === 200) {
        Swal.fire('Success', `Request marked as ${newStatus}`, 'success');
        refetch();
      }
    }
  };

  return (
    <div className="p-6">

      <Helmet>
        <title>Blood.net | Incoming Donation Requests</title>
        <meta name="description" content="View incoming blood donation requests on your dashboard." />
      </Helmet>

      <h2 className="text-2xl font-bold mb-4 text-[#E63946]">Incoming Donation Requests</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : data.requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <div className="space-y-4">
          {data.requests.map((req, i) => (
            <div
              key={req._id}
              className="border p-6 rounded-xl shadow-md bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#1D1D1D] mb-1">
                  Request #{(page - 1) * limit + i + 1}
                </h3>
                <p><strong>From:</strong> {req.recipientName}</p>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
                  req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  req.status === 'fulfilled' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {req.status.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  className="px-4 py-1 text-sm rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                  onClick={() => setSelectedRequest(req)}
                >
                  View
                </button>
                {req.status === 'pending' && (
                  <>
                    <button
                      className="px-4 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                      onClick={() => handleStatusUpdate(req._id, 'fulfilled')}
                    >
                      Accept
                    </button>
                    <button
                      className="px-4 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                      onClick={() => handleStatusUpdate(req._id, 'cancelled')}
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Next
            </button>
          </div>

          {/* Modal */}
          {selectedRequest && (
            <Dialog
              open={!!selectedRequest}
              onClose={() => setSelectedRequest(null)}
              className="fixed z-50 inset-0 overflow-y-auto"
            >
              <div className="flex items-center justify-center min-h-screen px-4">
                <Dialog.Panel className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl border">
                  <Dialog.Title className="text-xl font-bold text-[#E63946] mb-4">
                    Request Details
                  </Dialog.Title>
                  <p><strong>From:</strong> {selectedRequest.recipientName}</p>
                  <p><strong>Email:</strong> {selectedRequest.recipientEmail}</p>
                  <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                  <p><strong>Blood Group:</strong> {selectedRequest.bloodGroup}</p>
                  <p><strong>Location:</strong> {selectedRequest.district}, {selectedRequest.upazila}</p>
                  <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                  <p><strong>Status:</strong> {selectedRequest.status}</p>
                  <div className="mt-6 text-right">
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="px-4 py-2 rounded bg-[#E63946] text-white hover:bg-[#A4161A]"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
};

export default IncomingRequests;
