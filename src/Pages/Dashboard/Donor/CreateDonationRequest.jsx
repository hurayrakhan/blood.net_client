import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../Providers/AuthProvider';
import Swal from 'sweetalert2';
import axiosSecure from '../../../api/axiosSecure';
import districts from '../../../../public/districts.json';
import upazilas from '../../../../public/upazilas.json';
import { Helmet } from 'react-helmet-async';

const CreateDonationRequest = () => {
    const { user, userStatus } = useContext(AuthContext);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm();

    const selectedDistrictId = watch('recipientDistrict');

    useEffect(() => {
        if (selectedDistrictId) {
            const filtered = upazilas.filter(
                (upazila) => upazila.district_id === selectedDistrictId
            );
            setFilteredUpazilas(filtered);
        } else {
            setFilteredUpazilas([]);
        }
    }, [selectedDistrictId]);

    const onSubmit = async (data) => {
        try {
            // Find district name by selected ID
            const selectedDistrict = districts.find(
                (d) => d.id === data.recipientDistrict
            )?.name;

            // Prepare formatted data
            const donationData = {
                ...data,
                district: selectedDistrict || '',
                upazila: data.recipientUpazila,
                status: 'pending',
                requesterName: user?.displayName,
                requesterEmail: user?.email,
                createdAt: new Date().toISOString(),
            };

            // Remove old keys
            delete donationData.recipientDistrict;
            delete donationData.recipientUpazila;

            const res = await axiosSecure.post('/donations', donationData);
            if (res.data.insertedId) {
                Swal.fire('Success', 'Donation request created successfully!', 'success');
                reset();
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        }
    };


    if (userStatus === 'blocked') {
        return (
            <div className="text-center mt-10 text-red-500 font-semibold">
                🚫 You are blocked and cannot create donation requests.
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-md max-w-4xl mx-auto">
            <Helmet>
                <title>Blood.net | Create Donation Request</title>
                <meta name="description" content="Create a new blood donation request on Blood.net." />
            </Helmet>

            <h2 className="text-2xl font-bold text-[#E63946] mb-6">
                🩸 Create a Blood Donation Request
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Requester Name */}
                <div className="col-span-1">
                    <label className="font-medium">Requester Name</label>
                    <input
                        type="text"
                        value={user?.displayName || ''}
                        disabled
                        className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                    />
                </div>

                {/* Requester Email */}
                <div className="col-span-1">
                    <label className="font-medium">Requester Email</label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                    />
                </div>

                {/* Recipient Name */}
                <div className="col-span-1">
                    <label className="font-medium">Recipient Name</label>
                    <input
                        type="text"
                        {...register('recipientName', { required: true })}
                        className="w-full px-3 py-2 border rounded bg-gray-50"
                    />
                    {errors.recipientName && <p className="text-red-500 text-sm">This field is required</p>}
                </div>

                {/* Blood Group */}
                <div className="col-span-1">
                    <label className="font-medium">Blood Group</label>
                    <select
                        {...register('bloodGroup', { required: true })}
                        className="w-full px-3 py-2 border rounded bg-gray-50"
                    >
                        <option value="">Select Blood Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                            <option key={group} value={group}>
                                {group}
                            </option>
                        ))}
                    </select>
                    {errors.bloodGroup && <p className="text-red-500 text-sm">Select a blood group</p>}
                </div>

                {/* Recipient District */}
                <div className="col-span-1">
                    <label className="font-medium">Recipient District</label>
                    <select
                        {...register('recipientDistrict', { required: true })}
                        className="w-full px-3 py-2 border rounded bg-gray-50"
                    >
                        <option value="">Select District</option>
                        {districts.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                    {errors.recipientDistrict && <p className="text-red-500 text-sm">Required</p>}
                </div>

                {/* Recipient Upazila */}
                <div className="col-span-1">
                    <label className="font-medium">Recipient Upazila</label>
                    <select
                        {...register('recipientUpazila', { required: true })}
                        className="w-full px-3 py-2 border rounded bg-gray-50"
                    >
                        <option value="">Select Upazila</option>
                        {filteredUpazilas.map((u) => (
                            <option key={u.id} value={u.name}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                    {errors.recipientUpazila && <p className="text-red-500 text-sm">Required</p>}
                </div>

                {/* Hospital Name */}
                <div className="col-span-1">
                    <label className="font-medium">Hospital Name</label>
                    <input
                        type="text"
                        {...register('hospitalName', { required: true })}
                        className="w-full px-3 py-2 border rounded bg-gray-50"
                    />
                    {errors.hospitalName && <p className="text-red-500 text-sm">Required</p>}
                </div>

                {/* Full Address */}
                <div className="col-span-1">
                    <label className="font-medium">Full Address</label>
                    <input
                        type="text"
                        {...register('fullAddress', { required: true })}
                        className="w-full px-3 py-2 border rounded bg-gray-50"
                    />
                    {errors.fullAddress && <p className="text-red-500 text-sm">Required</p>}
                </div>

                {/* Date */}
                <div className="col-span-1">
                    <label className="font-medium">Donation Date</label>
                    <input
                        type="date"
                        {...register('donationDate', { required: true })}
                        className="w-full px-3 py-2 border rounded bg-gray-50"
                    />
                    {errors.donationDate && <p className="text-red-500 text-sm">Required</p>}
                </div>

                {/* Time */}
                <div className="col-span-1">
                    <label className="font-medium">Donation Time</label>
                    <input
                        type="time"
                        {...register('donationTime', { required: true })}
                        className="w-full px-3 py-2 border rounded bg-gray-50"
                    />
                    {errors.donationTime && <p className="text-red-500 text-sm">Required</p>}
                </div>

                {/* Request Message */}
                <div className="col-span-2">
                    <label className="font-medium">Request Message</label>
                    <textarea
                        {...register('requestMessage', { required: true })}
                        rows={4}
                        className="w-full px-3 py-2 border rounded bg-gray-50"
                        placeholder="Why do you need the blood?"
                    />
                    {errors.requestMessage && <p className="text-red-500 text-sm">Required</p>}
                </div>

                {/* Submit Button */}
                <div className="col-span-2">
                    <button
                        type="submit"
                        className="w-full bg-[#E63946] hover:bg-[#A4161A] text-white py-2 px-4 rounded-md transition"
                    >
                        Submit Donation Request
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateDonationRequest;
