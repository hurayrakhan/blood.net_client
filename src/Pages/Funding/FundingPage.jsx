// pages/FundingPage.jsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useContext } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import FundingSummaryCard from './components/FundingSummaryCard';
import CheckoutForm from './components/CheckoutForm';
import { Helmet } from 'react-helmet-async';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function FundingPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      <Helmet>
        <title>Blood.net | Donate & Support</title>
        <meta name="description" content="Contribute to Blood.net’s mission by funding our operations. Every donation matters." />
      </Helmet>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#E63946]">Support Blood.net ❤️</h1>
        <p className="text-gray-700 mt-2">
          Every donation helps us save more lives. Be a hero with your support.
        </p>
      </div>

      <FundingSummaryCard user={user} />

      <div className="bg-white shadow rounded-lg p-6">
        <div className='flex justify-between'>
          <h2 className="text-xl font-semibold text-[#E63946] mb-4">Donate Now 💳</h2>
          <div className='flex'>
            <img className='h-16 object-cover' src="https://i.ibb.co.com/pm0LMdx/realistic-credit-card-design-23-2149126090.jpg" alt="" />
            <img className='h-16 object-cover' src="https://i.ibb.co.com/22M9KC6/debit-card-purple-color-48190-234.jpg" alt="" />
          </div>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm user={user} />
        </Elements>
      </div>

      {/* ➕ Navigate to Funding History Page */}
      <div className="text-center pt-6">
        <button
          onClick={() => navigate('/dashboard/fundingHistory')}
          className="inline-block bg-[#E63946] hover:bg-[#A4161A] text-white font-semibold px-6 py-3 rounded"
        >
          View Funding History
        </button>
      </div>
    </div>
  );
}
