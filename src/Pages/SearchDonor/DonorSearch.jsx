import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Droplet, MapPin, LayoutGrid, List } from 'lucide-react';
import axiosSecure from '../../api/axiosSecure';
import { AuthContext } from '../../Providers/AuthProvider';
import { Helmet } from 'react-helmet-async';

const DonorSearchPage = () => {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');
  const navigate = useNavigate();

  const { data: donors = [], isLoading } = useQuery({
    queryKey: ['donors', search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${encodeURIComponent(search)}`);
      return res.data;
    },
  });

  const handleRequest = (donor) => {
    if (!user) return navigate('/login');

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
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <Helmet>
        <title>Search Donors | Blood.net</title>
        <meta
          name="description"
          content="Find blood donors in your area by group, location, or name. Blood.net helps connect donors with patients in need."
        />
      </Helmet>

      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#E63946]">
          Find a Blood Donor
        </h2>
      </div>

      {/* Search bar + View toggle */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by district or blood group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#E63946] focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView('grid')}
            className={`p-3 rounded-lg border transition ${view === 'grid'
                ? 'bg-[#E63946] text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-3 rounded-lg border transition ${view === 'list'
                ? 'bg-[#E63946] text-white shadow'
                : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* States */}
      {isLoading ? (
        <p className="text-center text-[#E63946] text-lg">Loading donors...</p>
      ) : donors.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No donors found. Try searching by district or blood group.
        </p>
      ) : view === 'grid' ? (
        // GRID VIEW
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {donors.map((donor) => (
            <div
              key={donor._id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-200 flex flex-col justify-between h-96" // 👈 set fixed height
            >
              <div className="p-6 flex flex-col items-center text-center">
                <img
                  src={donor.avatar || 'https://via.placeholder.com/100'}
                  alt={donor.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#FFDADA] mb-4 group-hover:scale-105 transition"
                />
                <h3 className="text-xl font-semibold text-[#1D1D1D] mb-1 truncate w-full">
                  {donor.name}
                </h3>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  <span className="flex items-center gap-1 bg-[#E63946]/10 text-[#E63946] text-sm font-medium px-3 py-1 rounded-full truncate">
                    <Droplet size={14} /> {donor.bloodGroup}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full truncate">
                    <MapPin size={14} /> {donor.district}, {donor.upazila}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 p-6">
                <button
                  onClick={() => (user ? handleRequest(donor) : navigate('/login'))}
                  className="w-full bg-[#E63946] hover:bg-[#A4161A] text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  {user ? 'Request Donation' : 'Login to Request'}
                </button>
                <button
                  onClick={() => navigate(`/donor/${donor._id}`)}
                  className="w-full text-[#A4161A] hover:text-[#E63946] underline font-medium transition"
                >
                  View Profile
                </button>
              </div>
            </div>

          ))}
        </div>
      ) : (
        // LIST VIEW
        <div className="space-y-4">
          {donors.map((donor) => (
            <div
              key={donor._id}
              className="flex items-center gap-4 bg-white rounded-xl shadow-md hover:shadow-lg p-4 border border-gray-200 transition"
            >
              <img
                src={donor.avatar || 'https://via.placeholder.com/100'}
                alt={donor.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#FFDADA]"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#1D1D1D]">
                  {donor.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Blood Group: <strong>{donor.bloodGroup}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Location: {donor.district}, {donor.upazila}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() =>
                    user ? handleRequest(donor) : navigate('/login')
                  }
                  className="bg-[#E63946] hover:bg-[#A4161A] text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  {user ? 'Request' : 'Login'}
                </button>
                <button
                  onClick={() => navigate(`/donor/${donor._id}`)}
                  className="text-[#A4161A] hover:text-[#E63946] underline text-sm"
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
