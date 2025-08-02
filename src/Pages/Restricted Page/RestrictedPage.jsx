import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const RestrictedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fef3f3] text-[#E63946] px-6 text-center">
      <FaLock className="text-6xl mb-4" />
      <h1 className="text-3xl font-bold mb-2">Access Restricted</h1>
      <p className="mb-4 text-gray-700">You do not have permission to view this page.</p>
      <Link
        to="/"
        className="inline-block px-6 py-2 rounded-md bg-[#E63946] text-white hover:bg-[#A4161A] transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default RestrictedPage;
