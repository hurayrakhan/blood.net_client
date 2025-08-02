import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../api/axiosSecure';
import { useContext } from 'react';
import { AuthContext } from '../../../Providers/AuthProvider';
import { Helmet } from 'react-helmet-async';

const DonorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { data: donor = {}, isLoading } = useQuery({
    queryKey: ['donorProfile', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/usersProfile/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const {
    name,
    bloodGroup,
    district,
    upazila,
    avatar,
    email,
    lastDonationDate,
    totalDonations = 0,
  } = donor || {};

  const hasDonatedRecently = () => {
    if (!lastDonationDate) return false;
    const lastDate = new Date(lastDonationDate);
    const now = new Date();
    const diffMonths =
      (now.getFullYear() - lastDate.getFullYear()) * 12 +
      (now.getMonth() - lastDate.getMonth());
    return diffMonths < 3;
  };

  const getBadge = () => {
    if (totalDonations >= 10) return '🥇 Gold Donor';
    if (totalDonations >= 5) return '🥈 Silver Donor';
    if (totalDonations >= 1) return '🥉 Bronze Donor';
    return '🆕 New Donor';
  };

  const handleRequestDonation = () => {
    if (!user) return navigate('/login');
    navigate(`/donationRequestToDonor/${name}`, {
      state: {
        donorEmail: email,
        bloodGroup,
        district,
        upazila,
      },
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">

      <Helmet>
        <title>Blood.net | Donor Profile</title>
        <meta name="description" content="View detailed donor profile including availability, contact info, last donation date, and request donation directly." />
      </Helmet>

      <h2 className="text-4xl font-bold text-center text-[#E63946] mb-10">
        Donor Profile
      </h2>

      {isLoading ? (
        <p className="text-center text-[#E63946]">Loading profile...</p>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center space-y-4">
          <img
            src={avatar || 'https://via.placeholder.com/150'}
            alt={name}
            className="w-32 h-32 rounded-full border-4 border-[#E63946] object-cover shadow-[0_0_20px_rgba(230,57,70,0.4)]"
          />
          <h3 className="text-2xl font-bold text-[#1D1D1D] flex items-center gap-2">
            {name}
            <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full border">
              {getBadge()}
            </span>
          </h3>

          <div className="text-gray-700 text-center space-y-1">
            <p>
              <span className="font-medium">Blood Group:</span>{' '}
              <strong>{bloodGroup}</strong>
            </p>
            <p>
              <span className="font-medium">Location:</span> {district}, {upazila}
            </p>
            <p>
              <span className="font-medium">Email:</span> {email}
            </p>
            <p>
              <span className="font-medium">Total Donations:</span>{' '}
              <strong>{totalDonations}</strong>
            </p>
            <p>
              <span className="font-medium">Last Donation:</span>{' '}
              <strong>
                {lastDonationDate
                  ? new Date(lastDonationDate).toLocaleDateString()
                  : 'N/A'}
              </strong>
            </p>
            <p>
              <span className="font-medium">Availability:</span>{' '}
              <span className={hasDonatedRecently() ? 'text-yellow-600' : 'text-green-600'}>
                {hasDonatedRecently() ? 'Recently Donated (Unavailable)' : 'Available to Donate'}
              </span>
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleRequestDonation}
              disabled={!user || hasDonatedRecently()}
              className={`px-6 py-2 rounded-lg font-semibold transition text-white ${!user || hasDonatedRecently()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#E63946] hover:bg-[#A4161A]'
                }`}
            >
              {user ? 'Request Donation' : 'Login to Request'}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorProfilePage;
