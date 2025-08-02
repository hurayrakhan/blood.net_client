import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Error Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24 text-red-500 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
        />
      </svg>

      {/* Error Message */}
      <h1 className="text-7xl font-extrabold mb-2">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
        Oops! The page you're looking for doesn’t exist.
      </p>

      {/* Go Home Button */}
      <button
        onClick={() => navigate('/')}
        className="mt-4 px-8 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-300"
      >
        Go Back Home
      </button>
    </div>
  );
}
