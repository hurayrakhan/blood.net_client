import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import axiosSecure from '../../../api/axiosSecure';
import { Helmet } from 'react-helmet-async';

export default function AllFundingsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedFunding, setSelectedFunding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 10;

  const {
    data: fundingsData = { fundings: [], total: 0 },
    isLoading,
  } = useQuery({
    queryKey: ['allFundings', search, page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/fundings/all?search=${search}&page=${page}&limit=${limit}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(fundingsData.total / limit);

  const openModal = (funding) => {
    setSelectedFunding(funding);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto">

      <Helmet>
        <title>Blood.net | Funding</title>
        <meta name="description" content="Support our cause by funding blood donation initiatives securely via Stripe." />
      </Helmet>


      <h2 className="text-2xl md:text-3xl font-bold text-[#E63946] mb-6 text-center md:text-left">
        All Fundings 💵
      </h2>

      {/* Search */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 max-w-md mx-auto sm:mx-0">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow px-4 py-2 border rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#E63946]"
        />
        <button
          className="bg-[#E63946] hover:bg-[#A4161A] text-white px-4 py-2 rounded text-sm sm:text-base flex items-center justify-center"
          aria-label="Search"
        >
          <FaSearch />
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-center text-[#E63946] py-6">Loading fundings...</p>
      ) : fundingsData.fundings.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No funding data found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow">
          <table className="min-w-full table-auto text-sm md:text-base">
            <thead className="bg-[#FFEDEE] text-[#A4161A]">
              <tr>
                <th className="p-2 md:p-3 text-left whitespace-nowrap">#</th>
                <th className="p-2 md:p-3 text-left whitespace-nowrap">Name</th>
                <th className="p-2 md:p-3 text-left whitespace-nowrap">Amount</th>
                <th className="p-2 md:p-3 text-left whitespace-nowrap">Tx ID</th>
                <th className="p-2 md:p-3 text-left whitespace-nowrap">Date</th>
                <th className="p-2 md:p-3 text-left whitespace-nowrap">Status</th>
                <th className="p-2 md:p-3 text-left whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {fundingsData.fundings.map((f, i) => (
                <tr
                  key={f._id}
                  className="border-t hover:bg-[#FFF6F6] cursor-pointer"
                  onClick={() => openModal(f)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openModal(f)}
                >
                  <td className="p-2 md:p-3 whitespace-nowrap">{(page - 1) * limit + i + 1}</td>
                  <td className="p-2 md:p-3 whitespace-nowrap">{f.name || 'N/A'}</td>
                  <td className="p-2 md:p-3 font-semibold whitespace-nowrap">${(f.amount / 100).toFixed(2)}</td>
                  <td className="p-2 md:p-3 truncate max-w-[150px]">{f.transactionId}</td>
                  <td className="p-2 md:p-3 whitespace-nowrap">{new Date(f.createdAt).toLocaleString()}</td>
                  <td className="p-2 md:p-3 whitespace-nowrap">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${f.status === 'succeeded'
                        ? 'bg-green-100 text-green-700'
                        : f.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="p-2 md:p-3 whitespace-nowrap text-[#E63946] hover:text-[#A4161A] flex items-center gap-1">
                    <FaEye />
                    <span className="hidden sm:inline">View</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 p-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`w-full sm:w-auto px-4 py-2 rounded text-white font-medium ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#E63946] hover:bg-[#A4161A]'
                }`}
            >
              Prev
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`w-full sm:w-auto px-4 py-2 rounded text-white font-medium ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#E63946] hover:bg-[#A4161A]'
                }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold text-[#E63946] mb-4">
              Funding Details
            </Dialog.Title>
            {selectedFunding && (
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>Name:</strong> {selectedFunding.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedFunding.email}
                </p>
                <p>
                  <strong>Amount:</strong> ${(selectedFunding.amount / 100).toFixed(2)}
                </p>
                <p>
                  <strong>Transaction ID:</strong> {selectedFunding.transactionId}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`px-2 py-1 rounded-full font-semibold ${selectedFunding.status === 'succeeded'
                      ? 'bg-green-100 text-green-700'
                      : selectedFunding.status === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    {selectedFunding.status}
                  </span>
                </p>
                <p>
                  <strong>Date:</strong> {new Date(selectedFunding.createdAt).toLocaleString()}
                </p>
                {selectedFunding.message && (
                  <p>
                    <strong>Message:</strong> {selectedFunding.message}
                  </p>
                )}
              </div>
            )}
            <div className="text-right mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
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
