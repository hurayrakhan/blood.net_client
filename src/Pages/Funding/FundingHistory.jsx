import { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../../Providers/AuthProvider';
import axiosSecure from '../../api/axiosSecure';
import { Dialog } from '@headlessui/react';
import { Helmet } from 'react-helmet-async';

export default function FundingHistoryPage() {
  const { user } = useContext(AuthContext);
  const [selectedFunding, setSelectedFunding] = useState(null);

  const { data: fundings = [], isLoading } = useQuery({
    queryKey: ['userFundings', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/fundings?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">

      <Helmet>
        <title>Blood.net | Funding History</title>
        <meta name="description" content="View your history of funding contributions and track your support for blood donation causes." />
      </Helmet>

      <h2 className="text-3xl font-bold text-[#E63946] mb-6 text-center">My Funding History 💸</h2>

      {isLoading ? (
        <p className="text-center text-[#E63946]">Loading donations...</p>
      ) : fundings.length === 0 ? (
        <p className="text-center text-gray-500">No donations found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-[#FFEDEE] text-[#A4161A]">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Transaction ID</th>
                <th className="p-3 text-left hidden sm:table-cell">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {fundings.map((item, idx) => (
                <tr key={item._id} className="border-t hover:bg-[#FFF6F6]">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-semibold">${(item.amount / 100).toFixed(2)}</td>
                  <td className="p-3 break-all">{item.transactionId}</td>
                  <td className="p-3 hidden sm:table-cell">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium
                        ${item.status === 'succeeded'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'}
                      `}
                    >
                      {item.status || 'N/A'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedFunding(item)}
                      className="text-sm text-[#E63946] hover:underline"
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View More Modal */}
      <Dialog
        open={!!selectedFunding}
        onClose={() => setSelectedFunding(null)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="min-h-screen px-4 flex items-center justify-center bg-black/30">
          <Dialog.Panel className="bg-white p-6 rounded max-w-md w-full shadow-lg">
            <Dialog.Title className="text-xl font-bold text-[#E63946] mb-4">
              Funding Details
            </Dialog.Title>
            {selectedFunding && (
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Amount:</strong> ${(selectedFunding.amount / 100).toFixed(2)}</p>
                <p><strong>Transaction ID:</strong> {selectedFunding.transactionId}</p>
                <p><strong>Status:</strong> {selectedFunding.status}</p>
                <p><strong>Date:</strong> {new Date(selectedFunding.createdAt).toLocaleString()}</p>
                {selectedFunding.email && (
                  <p><strong>Email:</strong> {selectedFunding.email}</p>
                )}
                {selectedFunding.name && (
                  <p><strong>Name:</strong> {selectedFunding.name}</p>
                )}
              </div>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedFunding(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
