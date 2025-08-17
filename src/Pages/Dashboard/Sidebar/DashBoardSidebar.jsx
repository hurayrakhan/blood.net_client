// components/DashboardSidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaTint,
  FaPlusCircle,
  FaUsers,
  FaBlog,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaFileInvoiceDollar,
  FaDonate,
  FaInbox,
  FaClipboardList,
  FaAddressCard
} from 'react-icons/fa';

import Swal from 'sweetalert2';
import { useContext } from 'react';
import { AuthContext } from '../../../Providers/AuthProvider';
import { HandHeart } from 'lucide-react';

const SidebarLink = ({ to, label, icon, end = false, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${isActive
        ? 'bg-white text-[#E63946] shadow font-semibold'
        : 'text-white hover:bg-white/20'
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    {label}
  </NavLink>
);

const DashboardSidebar = ({ closeSidebar }) => {
  const { userRole, signOutUser } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleLogout = () => {
    signOutUser()
      .then(() => {
        Swal.fire('Logged Out', 'You have successfully logged out.', 'success');
        navigate('/');
        if (closeSidebar) closeSidebar();
      })
      .catch(() => {
        Swal.fire('Error', 'Logout failed. Try again.', 'error');
      });
  };

  const links = {
    donor: [
      { to: '/dashboard', label: 'Dashboard Home', icon: <FaHome /> },
      { to: '/dashboard/myRequests', label: 'My Requests', icon: <FaClipboardList /> },
      { to: '/dashboard/incomingRequests', label: 'Received Requests', icon: <FaInbox /> },
      { to: '/dashboard/createRequest', label: 'Create Request', icon: <FaPlusCircle /> },
      { to: '/dashboard/donationLog', label: 'My Donations', icon: <HandHeart /> },
      { to: '/dashboard/fundingHistory', label: 'My Fundings', icon: <FaDonate /> },
    ],
    admin: [
      { to: '/dashboard', label: 'Dashboard Home', icon: <FaHome /> },
      { to: '/dashboard/allUsers', label: 'All Users', icon: <FaUsers /> },
      { to: '/dashboard/allDonationRequests', label: 'All Requests', icon: <FaTint /> },
      { to: '/dashboard/allFundings', label: 'All Fundings', icon: <FaFileInvoiceDollar /> },
      { to: '/dashboard/contentManagement', label: 'Manage Blogs', icon: <FaBlog /> },
      { to: '/dashboard/myRequests', label: 'My Requests', icon: <FaClipboardList /> },
      { to: '/dashboard/incomingRequests', label: 'Received Requests', icon: <FaInbox /> },
      { to: '/dashboard/createRequest', label: 'Create Request', icon: <FaPlusCircle /> },
      { to: '/dashboard/donationLog', label: 'My Donations', icon: <HandHeart /> },
      { to: '/dashboard/fundingHistory', label: 'My Fundings', icon: <FaDonate /> },
    ],
    volunteer: [
      { to: '/dashboard', label: 'Dashboard Home', icon: <FaHome /> },
      { to: '/dashboard/allDonationRequests', label: 'All Requests', icon: <FaTint /> },
      { to: '/dashboard/allFundings', label: 'All Fundings', icon: <FaFileInvoiceDollar /> },
      { to: '/dashboard/contentManagement', label: 'Manage Blogs', icon: <FaBlog /> },
      { to: '/dashboard/myRequests', label: 'My Requests', icon: <FaClipboardList /> },
      { to: '/dashboard/incomingRequests', label: 'Received Requests', icon: <FaInbox /> },
      { to: '/dashboard/createRequest', label: 'Create Request', icon: <FaPlusCircle /> },
      { to: '/dashboard/donationLog', label: 'My Donations', icon: <HandHeart /> },
      { to: '/dashboard/fundingHistory', label: 'My Fundings', icon: <FaDonate /> },
    ],
  };

  const navLinks = links[userRole];

  return (
    <div className="flex flex-col justify-between h-screen fixed bg-[#E63946] text-white p-5 w-64 rounded-r-2xl shadow-md">
      {/* Top Links */}
      <div className="overflow-hidden">
        <h2 className="text-2xl font-bold mb-6">Blood.net</h2>
        <nav className="space-y-2">
          <SidebarLink to="/" label="Return Home" icon={<FaHome />} end onClick={closeSidebar} />
          {navLinks.map((link) => (
            <SidebarLink key={link.to} {...link} onClick={closeSidebar} />
          ))}
        </nav>
      </div>

      {/* Bottom Links */}
      <div className="space-y-2 border-t border-white/30 pt-4 sticky">
        <SidebarLink to="/dashboard/profile" label="Profile" icon={<FaUserCircle />} onClick={closeSidebar} />
        <SidebarLink to="/settings" label="Settings" icon={<FaCog />} onClick={closeSidebar} />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-white/20 w-full text-left"
        >
          <FaSignOutAlt className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
