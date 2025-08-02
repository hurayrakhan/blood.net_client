// components/Funding/FundingSummaryCard.jsx
export default function FundingSummaryCard({ user }) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-[#E63946] mb-4">Your Information</h3>
      <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <p><span className="font-medium">Name:</span> {user?.displayName || 'N/A'}</p>
        <p><span className="font-medium">Email:</span> {user?.email || 'N/A'}</p>
        <div className="col-span-2">
          <p className="font-medium">Photo:</p>
          <img
            src={user?.photoURL || 'https://i.ibb.co/S3b6gXN/user.png'}
            alt="User"
            className="w-20 h-20 mt-2 rounded-full border"
          />
        </div>
      </div>
    </div>
  );
}
