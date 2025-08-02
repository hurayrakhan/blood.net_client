import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosSecure from '../../api/axiosSecure';
import { AuthContext } from '../../Providers/AuthProvider';
import { Helmet } from 'react-helmet-async';

const DonorSearchPage = () => {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data: donors = [], isLoading } = useQuery({
    queryKey: ['donors', search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users`);
      return res.data;
    },
  });

  const handleRequest = (donor) => {
    
    if (!user) return navigate('/login');

    // Optional: check if donor recently donated
    navigate(`/donationRequestToDonor/${donor.name}`, {
      state: {
        donorEmail: donor.email,
        bloodGroup: donor.bloodGroup,
        district: donor.district,
        upazila: donor.upazila,
      },
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">

      <Helmet>
        <title>Search Donors | Blood.net</title>
        <meta name="description" content="Find blood donors in your area by group, location, or name. Blood.net helps connect donors with patients in need." />
      </Helmet>

      <h2 className="text-3xl font-bold text-center text-[#E63946] mb-6">Search Donors</h2>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by district or blood group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full max-w-md"
        />
      </div>

      {isLoading ? (
        <p className="text-center text-[#E63946]">Loading donors...</p>
      ) : donors.length === 0 ? (
        <p className="text-center text-gray-500">No donors found.</p>
      ) : (
        <div className="space-y-4">
          {donors.map((donor, i) => (
            <div
              key={donor._id}
              className="flex gap-4 items-center bg-white rounded-xl shadow p-4 border hover:shadow-md transition"
            >
              <img
                src={donor.avatar || 'https://via.placeholder.com/100'}
                alt={donor.name}
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#1D1D1D]">{donor.name}</h3>
                <p className="text-sm text-gray-600">Blood Group: <strong>{donor.bloodGroup}</strong></p>
                <p className="text-sm text-gray-600">Location: {donor.district}, {donor.upazila}</p>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <button
                  onClick={() => user ? handleRequest(donor) : navigate('/login')}
                  className="bg-[#E63946] hover:bg-[#A4161A] text-white px-4 py-2 rounded"
                >
                  {user ? 'Request Donation' : 'Login to Request'}
                </button>
                <button
                  onClick={() => navigate(`/donor/${donor._id}`)}
                  className="text-[#A4161A] underline hover:text-[#E63946]"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorSearchPage;
