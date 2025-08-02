import { useQuery } from '@tanstack/react-query';
import { useState, useContext } from 'react';
import axiosSecure from '../../../api/axiosSecure';
import { motion } from 'framer-motion';
import { FaUsers, FaHandHoldingMedical, FaClock, FaTint, FaMoneyBill } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../Providers/AuthProvider';

const AdminDashboardHome = () => {
  const navigate = useNavigate();
  const { user, userRole } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const limit = 5;

  const userName = user?.displayName || 'User';

  // Fetch stats for Admin
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/stats');
      return res.data;
    },
    enabled: userRole === 'admin',
  });

  // Fetch donations for Admin (full data)
  const { data: requestsData = {}, isLoading: requestsLoading } = useQuery({
    queryKey: ['adminDonations', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/donations?limit=${limit}&page=${page}&sort=desc`);
      return res.data;
    },
    enabled: userRole === 'admin',
  });
  

  const totalPages = Math.ceil((requestsData?.total || 0) / limit);

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="pb-4 mb-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-[#E63946]">Welcome back, {userName}! 👋</h1>
        <p className="text-gray-600 mt-1">Manage your dashboard efficiently.</p>
      </div>

      {(statsLoading || requestsLoading) ? (
        <div className="text-center py-20 text-[#E63946] font-semibold text-lg">
          Loading dashboard data...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <SummaryCard icon={<FaUsers className="text-4xl" />} label="Total Users" count={stats.totalUsers || 0} color="bg-red-100 text-red-700" />

            <SummaryCard icon={<FaTint className="text-4xl" />} label="Total Requests" count={stats.totalRequests || 0} color="bg-pink-100 text-pink-700" />
            <SummaryCard icon={<FaClock className="text-4xl" />} label="Pending Requests" count={stats.pendingRequests || 0} color="bg-yellow-100 text-yellow-700" />
            <SummaryCard icon={<FaHandHoldingMedical className="text-4xl" />} label="Total Fundings" count={stats.totalFunding || 0} color="bg-purple-100 text-purple-700" />
            <SummaryCard
              icon={<FaMoneyBill className="text-4xl" />}
              label="Total Funding (USD)"
              count={`$${(stats.totalFundingAmount / 110).toFixed(0)}`}
              color="bg-green-100 text-green-700"
            />

          </div>


          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <ActionButton label="Manage Users" onClick={() => navigate('/dashboard/allUsers')} color="bg-[#E63946] hover:bg-[#A4161A]" />
            <ActionButton label="Manage Requests" onClick={() => navigate('/dashboard/allDonationRequests')} color="bg-[#E63946] hover:bg-[#A4161A]" />
            <ActionButton label="Manage Blogs" onClick={() => navigate('/dashboard/contentManagement')} color="bg-[#E63946] hover:bg-[#A4161A]" />
          </div>

          {/* Recent Donation Requests Table */}
          <section>
            <h2 className="text-2xl font-bold text-[#E63946] mb-4">Recent Donation Requests</h2>
            {requestsData?.requests && requestsData?.requests.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full table-auto border-collapse">
                  <thead className="bg-[#FFEDEE] text-[#A4161A] text-left text-sm font-semibold">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Blood Group</th>
                      <th className="p-3">Recipient</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestsData?.requests.map((req, i) => (
                      <tr key={req._id} className="border-b hover:bg-[#fef3f3] transition">
                        <td className="p-3">{(page - 1) * limit + i + 1}</td>
                        <td className="p-3 font-semibold">{req.bloodGroup}</td>
                        <td className="p-3">{req.recipientName}</td>
                        <td className="p-3">{req.district}, {req.upazila}</td>
                        <td className="p-3">{new Date(req.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <StatusBadge status={req.status} />
                        </td>
                        <td className="p-3">
                          {/* Actions like Edit, Delete can go here */}
                          <button
                            className="text-[#E63946] hover:underline font-semibold"
                            onClick={() => navigate(`/dashboard/edit-request/${req._id}`)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationControls page={page} setPage={setPage} totalPages={totalPages} />
              </div>
            ) : (
              <p className="text-gray-600">No donation requests found.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

function SummaryCard({ icon, label, count, color }) {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center rounded-xl p-6 shadow ${color}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>{icon}</div>
      <div className="text-3xl font-bold mt-3">{count}</div>
      <div className="mt-1 text-sm uppercase tracking-wide">{label}</div>
    </motion.div>
  );
}

function ActionButton({ label, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-md font-semibold text-white transition ${color}`}
    >
      {label}
    </button>
  );
}

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

export default AdminDashboardHome;
