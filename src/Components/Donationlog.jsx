import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../Providers/AuthProvider';
import axiosSecure from '../api/axiosSecure';
import { Helmet } from 'react-helmet-async';

export default function DonationLog() {
  const { user } = useContext(AuthContext);

  const { data: logs = [], isLoading, isError } = useQuery({
    queryKey: ['donationLogs', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(`/donations/logs?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <p className="text-center text-gray-600">Loading donation logs...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load donation logs.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">

      <Helmet>
        <title>Blood.net | Donation Log</title>
        <meta name="description" content="View your blood donation history and logs on Blood.net." />
      </Helmet>

      <h2 className="text-2xl font-bold text-[#E63946] mb-6">My Donation Log</h2>

      {logs.length === 0 ? (
        <p className="text-gray-600">You haven't fulfilled any donation requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {logs.map((log) => (
            <li key={log._id} className="bg-white shadow p-4 rounded border">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#E63946]">{log.recipientName}</h3>
                <span className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  {log.status}
                </span>
              </div>
              <p className="text-sm text-gray-600"><strong>Blood Group:</strong> {log.bloodGroup}</p>
              <p className="text-sm text-gray-600"><strong>District:</strong> {log.district}, {log.upazila}</p>
              <p className="text-sm text-gray-600"><strong>Hospital:</strong> {log.hospitalName}</p>
              <p className="text-sm text-gray-600"><strong>Date:</strong> {log.donationDate}</p>
              <p className="text-sm text-gray-600"><strong>Message:</strong> {log.requestMessage?.slice(0, 80)}...</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
