import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import axiosSecure from '../../api/axiosSecure';
import { Helmet } from 'react-helmet-async';

const DonationRequestToDonor = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const donationData = {
      requesterEmail: user.email,
      recipientName: data.recipientName,
      phone: data.phone,
      hospital: data.hospital,
      reason: data.reason,
      neededDate: data.neededDate,
      donorEmail: state?.donorEmail,
      bloodGroup: state?.bloodGroup,
      district: state?.district,
      upazila: state?.upazila,
      status: 'pending',
      createdAt: new Date(),
    };

    try {
      const res = await axiosSecure.post('/donations', donationData);
      if (res.data.insertedId) {
        Swal.fire('Request Sent', 'Your donation request has been submitted.', 'success');
        navigate('/dashboard/myRequests');
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to submit the request.', 'error');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">

      <Helmet>
        <title>Blood.net | Request Blood from Donor</title>
        <meta name="description" content="Send a direct blood donation request to a selected donor. Specify your location, blood group, and message." />
      </Helmet>

      <h2 className="text-2xl font-bold text-[#E63946] mb-6 border-b pb-2">
        Create Blood Donation Request
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Donor Info - Read-only */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            value={state?.donorEmail}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />
          <input
            type="text"
            value={state?.bloodGroup}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />
          <input
            type="text"
            value={state?.district}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />
          <input
            type="text"
            value={state?.upazila}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />
        </div>

        {/* User Input */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Recipient Name</label>
            <input
              type="text"
              {...register('recipientName', { required: true })}
              className="border p-2 rounded w-full"
            />
            {errors.recipientName && <p className="text-sm text-red-500">Required</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input
              type="text"
              {...register('phone', { required: true })}
              className="border p-2 rounded w-full"
            />
            {errors.phone && <p className="text-sm text-red-500">Required</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Hospital</label>
            <input
              type="text"
              {...register('hospital', { required: true })}
              className="border p-2 rounded w-full"
            />
            {errors.hospital && <p className="text-sm text-red-500">Required</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Needed Date</label>
            <input
              type="date"
              {...register('neededDate', { required: true })}
              className="border p-2 rounded w-full"
            />
            {errors.neededDate && <p className="text-sm text-red-500">Required</p>}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block mb-1 text-sm font-medium">Reason for Request</label>
          <textarea
            {...register('reason', { required: true })}
            className="border p-2 rounded w-full"
            rows="4"
          ></textarea>
          {errors.reason && <p className="text-sm text-red-500">Required</p>}
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-[#E63946] text-white rounded hover:bg-[#A4161A] transition"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default DonationRequestToDonor;
