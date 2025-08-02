import React, { useContext, Fragment, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/AuthProvider';
import { Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';

import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  HomeIcon,
  UserGroupIcon,
  NewspaperIcon,
  ChatBubbleBottomCenterTextIcon,
  InformationCircleIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

import Swal from 'sweetalert2';
import { LogInIcon } from 'lucide-react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { user, signOutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/searchDonor', label: 'Donors', icon: UserGroupIcon },
    { to: '/allRequests', label: 'Request', icon: ChatBubbleBottomCenterTextIcon },
    { to: '/blogs', label: 'Blogs', icon: NewspaperIcon },
    { to: '/about', label: 'About', icon: InformationCircleIcon },
  ];

  const handleLogout = async () => {
    try {
      await signOutUser();
      Swal.fire({
        title: 'Logout Successful!',
        text: `${user.displayName || 'User'} 👋`,
        icon: 'success',
        confirmButtonColor: '#E63946',
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      Swal.fire({
        title: 'Logout Failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#E63946',
      });
    }
  };

  return (
    <div className='sticky top-0 bg-[#E63946] z-50'>
      <nav className=" w-11/12 mx-auto py-3 flex items-center justify-between select-none">
        {/* Logo */}
        <Link
          to="/"
          className="text-white hidden md:flex font-extrabold text-2xl items-center space-x-1"
        >
          <span>Blood</span>
          <span className="text-[#FFDADA]">.net</span>
        </Link>


        {/* Logo & Mobile Toggle */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white font-extrabold text-2xl flex items-center space-x-1 focus:outline-none"
          >
            <span>Blood</span>
            <span className="text-[#FFDADA]">.net</span>
            <svg
              className="ml-1 w-5 h-5 transform transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>


        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-8 relative">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const [isHovered, setIsHovered] = useState(false);

            return (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  classNames(
                    'relative flex items-center space-x-1 text-white font-medium px-1 py-2 cursor-pointer group',
                    'hover:text-[#FFDADA] transition-colors duration-300'
                  )
                }
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={classNames(
                        'h-5 w-5 transition-colors duration-300',
                        isActive ? 'text-[#FFDADA]' : 'text-white group-hover:text-[#FFDADA]'
                      )}
                      aria-hidden="true"
                    />
                    <span>{label}</span>

                    {/* Active underline */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFDADA]"
                        initial={false}
                        animate={{ width: '100%', opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}

                    {/* Hover underline */}
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFDADA]"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{
                        width: isHovered && !isActive ? '100%' : '0%',
                        opacity: isHovered && !isActive ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex items-center text-white outline-0 border border-white pl-1.5 pr-3 py-1.5 rounded-full space-x-2  hover:bg-white hover:text-[#E63946]  transition">
                <img
                  src={
                    user.photoURL ||
                    `https://ui-avatars.com/api/?name=${user.displayName || 'U'}`
                  }
                  alt={user.displayName || 'User'}
                  className="h-9 w-9 rounded-full object-cover border border-white"
                />
                <span className=" font-medium">{user.displayName || 'User'}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-[#E63946] ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={`/profile/${user.email}`}
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'flex items-center px-4 py-2 text-sm'
                          )}
                        >
                          <UserCircleIcon className="mr-3 h-5 w-5 text-gray-500" />
                          Profile
                        </Link>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/dashboard"
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'flex items-center px-4 py-2 text-sm'
                          )}
                        >
                          <Squares2X2Icon className="mr-3 h-5 w-5 text-gray-500" />
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'flex items-center px-4 py-2 text-sm'
                          )}
                        >
                          <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-500" />
                          Settings
                        </Link>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'flex items-center px-4 py-2 text-sm w-full text-left'
                          )}
                        >
                          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-500" />
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <div className="flex space-x-2">
              <Link
                to="/login"
                className="flex items-center border border-white text-white px-3 py-1.5 rounded hover:bg-white hover:text-[#E63946] transition"
              >
                <LogInIcon className="h-5 w-5 mr-1" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center bg-white text-[#E63946] px-3 py-1.5 rounded hover:bg-[#FFDADA] transition"
              >
                <UserPlusIcon className="h-5 w-5 mr-1" />
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 space-y-2 absolute top-full left-0 w-full z-40">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                classNames(
                  'block px-6 py-2 text-sm font-medium',
                  isActive ? 'text-[#E63946] font-semibold' : 'text-gray-700 hover:text-[#E63946]'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
