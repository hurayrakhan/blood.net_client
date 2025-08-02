// components/Funding/CheckoutForm.jsx
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function CheckoutForm({ user }) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !amount) return;

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) * 100 }),
      });
      const { clientSecret } = await res.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName || 'Anonymous',
            email: user?.email,
          },
        },
      });

      if (result.error) {
        Swal.fire('Payment Failed', result.error.message, 'error');
      } else if (result.paymentIntent.status === 'succeeded') {
        await saveFundingToDB(result.paymentIntent);
        Swal.fire('Thank You!', 'Your donation was successful. ❤️', 'success');
        setAmount('');
      }
    } catch (err) {
      Swal.fire('Error', 'Something went wrong.', 'error');
    }

    setLoading(false);
  };

  const saveFundingToDB = async (paymentIntent) => {
    const donationInfo = {
      email: user?.email,
      name: user?.displayName,
      amount: paymentIntent.amount / 100,
      transactionId: paymentIntent.id,
      date: new Date(),
      status: paymentIntent.status,
    };

    await fetch('http://localhost:5000/fundings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationInfo),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Donation Amount (USD)
        </label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
      </div>

      <div className="p-3 border rounded bg-gray-50">
        <CardElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-[#E63946] hover:bg-[#A4161A] text-white font-semibold px-6 py-3 rounded transition w-full"
      >
        {loading ? 'Processing...' : 'Donate Now'}
      </button>
    </form>
  );
}
