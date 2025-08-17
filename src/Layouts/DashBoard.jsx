// layouts/DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import { use, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardSidebar from '../Pages/Dashboard/Sidebar/DashBoardSidebar';
import { AuthContext } from '../Providers/AuthProvider';
import LoadingScreen from '../Components/Loading';
import { Helmet } from 'react-helmet-async';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userRole } = use(AuthContext);


  if (!userRole) {
    return <LoadingScreen></LoadingScreen>
  }

  return (
    <div className="flex min-h-screen bg-[#F1FAEE]">

      <Helmet>
        <title>Blood.net | Dashboard</title>
        <meta name="description" content="Overview of your Blood.net dashboard including stats, recent activities, and quick actions." />
      </Helmet>

      {/* Sidebar - Desktop */}
      <div className="hidden md:block w-64">
        <DashboardSidebar />
      </div>

      {/* Sidebar - Mobile Slide */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-md md:hidden"
          >
            <DashboardSidebar closeSidebar={() => setIsSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Topbar for Mobile */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-[#E63946] text-2xl"
          >
            <FaBars />
          </button>
          <h1 className="text-lg font-semibold text-[#1D1D1D]">Dashboard</h1>
        </div>

        {/* Outlet for Nested Routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
