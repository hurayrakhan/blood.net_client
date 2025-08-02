import { useContext, useState, useMemo } from 'react';
import { AuthContext } from '../../../Providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../api/axiosSecure';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const PAGE_SIZE = 10;

const AllUsers = () => {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: users = [], refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
    enabled: !!user,
  });

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = u.name ?? '';
      const email = u.email ?? '';
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [users, search]);


  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Group users by role for current page only
  const groupByRole = (role) => paginatedUsers.filter((u) => u.role === role);

  const countAdmins = users.filter((u) => u.role === 'admin').length;

  // Handle update with max 3 admins limit
  const handleUpdate = async (id, type) => {
    const field = type === 'role' ? 'role' : 'status';
    const inputLabel = type === 'role' ? 'Select New Role' : 'Select New Status';
    const options = type === 'role' ? ['admin', 'volunteer', 'donor'] : ['active', 'blocked'];

    const { value: selected } = await Swal.fire({
      title: inputLabel,
      input: 'select',
      inputOptions: Object.fromEntries(options.map((opt) => [opt, opt])),
      inputPlaceholder: `Choose ${field}`,
      showCancelButton: true,
    });

    if (!selected) return;

    // Check max admins limit
    if (field === 'role' && selected === 'admin' && countAdmins >= 3) {
      Swal.fire('Limit reached', 'Maximum 3 admins allowed.', 'warning');
      return;
    }

    try {
      await axiosSecure.patch(`/users/${id}/${field}`, { [field]: selected });
      Swal.fire('Success', `User ${field} updated to ${selected}`, 'success');
      refetch();
    } catch {
      Swal.fire('Error', 'Update failed', 'error');
    }
  };

  const renderRows = (userList) =>
    userList.map((u) => (
      <tr key={u._id} className="border-b">
        <td className="p-3">{u.name}</td>
        <td className="p-3 text-sm">{u.email}</td>
        <td className="p-3">
          <span
            className={`px-2 py-1 rounded text-white text-xs ${u.role === 'admin'
              ? 'bg-green-600'
              : u.role === 'volunteer'
                ? 'bg-blue-600'
                : 'bg-gray-500'
              }`}
          >
            {u.role}
          </span>
        </td>
        <td className="p-3">
          <span
            className={`px-2 py-1 rounded text-white text-xs ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'
              }`}
          >
            {u.status}
          </span>
        </td>
        <td className="p-3 space-x-2">
          <button
            onClick={() => handleUpdate(u._id, 'role')}
            className="text-blue-600 hover:underline"
            title="Edit Role"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleUpdate(u._id, 'status')}
            className="text-yellow-600 hover:underline"
            title="Edit Status"
          >
            <FaEdit />
          </button>
        </td>
      </tr>
    ));

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-6xl mx-auto">

      <Helmet>
        <title>Blood.net | Manage Users</title>
        <meta name="description" content="Admin dashboard to manage all users on Blood.net." />
      </Helmet>
      <h2 className="text-2xl font-bold mb-4 text-[#E63946]">👥 All Users</h2>

      <input
        type="text"
        placeholder="Search users by name or email"
        className="border px-4 py-2 mb-6 w-full md:w-1/2 rounded"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // reset page on search
        }}
      />

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border-collapse">
          <thead className="bg-[#FFEDEE] text-[#A4161A] text-sm uppercase">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          {/* Admin Section */}
          {groupByRole('admin').length > 0 && (
            <tbody>
              <tr className="bg-gray-100 text-gray-600">
                <td colSpan="5" className="px-3 py-2 font-medium">
                  Admin Users
                </td>
              </tr>
              {renderRows(groupByRole('admin'))}
            </tbody>
          )}

          {/* Volunteer Section */}
          {groupByRole('volunteer').length > 0 && (
            <tbody>
              <tr className="bg-gray-100 text-gray-600">
                <td colSpan="5" className="px-3 py-2 font-medium">
                  Volunteers
                </td>
              </tr>
              {renderRows(groupByRole('volunteer'))}
            </tbody>
          )}

          {/* Donor Section */}
          {groupByRole('donor').length > 0 && (
            <tbody>
              <tr className="bg-gray-100 text-gray-600">
                <td colSpan="5" className="px-3 py-2 font-medium">
                  Donors
                </td>
              </tr>
              {renderRows(groupByRole('donor'))}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded bg-[#E63946] text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span className="flex items-center px-2">{page}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded bg-[#E63946] text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsers;
