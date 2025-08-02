import React from 'react';
import { NavLink } from 'react-router-dom';
import { Fade } from 'react-awesome-reveal';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
} from 'react-icons/fa';

export default function Footer() {
  const linkClass = ({ isActive }) =>
    `block transition hover:text-[#E63946] ${
      isActive ? 'text-[#E63946] font-semibold' : 'text-gray-600'
    }`;

  return (
    <footer className="bg-red-50 border-t-2 border-red-300 text-gray-800">
      <Fade direction="up" triggerOnce>
        <div className="max-w-7xl mx-auto px-12 py-12 grid md:grid-cols-4 gap-10">
          {/* Logo & Tagline */}
          <div>
            <NavLink
              to="/"
              className="text-2xl font-extrabold text-[#E63946] mb-4 inline-block"
            >
              Blood<span className="text-red-800">.net</span>
            </NavLink>
            <p className="text-sm text-gray-600 mt-2">
              A modern platform to find blood donors and save lives. Join our mission today.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Navigation</h3>
            <nav className="space-y-2 text-sm">
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink to="/searchDonor" className={linkClass}>Find Donors</NavLink>
              <NavLink to="/blogs" className={linkClass}>Blogs</NavLink>
              <NavLink to="/allRequests" className={linkClass}>Requests</NavLink>
              <NavLink to="/about" className={linkClass}>About Us</NavLink>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="text-sm space-y-3">
              <li className="flex items-start gap-2 text-gray-600">
                <MapPinIcon className="h-5 w-5 text-[#E63946]" />
                <span>Khulna, Bangladesh</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <PhoneIcon className="h-5 w-5 text-[#E63946]" />
                <span>+880 1601770023</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <EnvelopeIcon className="h-5 w-5 text-[#E63946]" />
                <span>imhurayrakhan@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Personal Socials */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Connect With Me</h3>
            <div className="flex space-x-4 text-[#E63946] text-xl">
              <a
                href="https://github.com/hurayrakhan"
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition"
                title="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/hurayrakhan"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-700 transition"
                title="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="mailto:imhurayrakhan@gmail.com"
                className="hover:text-green-600 transition"
                title="Email"
              >
                <FaEnvelope />
              </a>
              <a
                href="https://www.facebook.com/hurayra.khan.965/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#1877F2] transition"
                title="Facebook"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-red-300 text-center text-sm py-4 text-gray-700">
          © {new Date().getFullYear()} Blood.net. All rights reserved.
        </div>
      </Fade>
    </footer>
  );
}
