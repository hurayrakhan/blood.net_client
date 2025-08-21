import { useContext, useState } from 'react';
import { AuthContext } from '../../Providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import axiosSecure from '../../api/axiosSecure';
import { Helmet } from 'react-helmet-async';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const imageHostKey = import.meta.env.VITE_IMAGEBB_API_KEY;

  const { data: userData = {}, isLoading } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: async (formData) => {
      return await axiosSecure.patch(`/users/${user.email}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile']);
      Swal.fire('Success', 'Profile updated successfully!', 'success');
      setEditMode(false);
    },
    onError: () => {
      Swal.fire('Error', 'Failed to update profile.', 'error');
    }
  });

  const onSubmit = async (data) => {
    let avatarUrl = userData.avatar;

    if (data.avatar && data.avatar[0]) {
      try {
        setUploading(true);
        const imageForm = new FormData();
        imageForm.append('image', data.avatar[0]);

        const imageRes = await fetch(`https://api.imgbb.com/1/upload?key=${imageHostKey}`, {
          method: 'POST',
          body: imageForm
        });
        const imageData = await imageRes.json();
        avatarUrl = imageData.data.url;
      } catch (error) {
        console.error('Image upload failed:', error);
        Swal.fire('Error', 'Failed to upload image.', 'error');
        return;
      } finally {
        setUploading(false);
      }
    }

    const updatedUser = {
      name: data.name,
      district: data.district,
      upazila: data.upazila,
      bloodGroup: data.bloodGroup,
      avatar: avatarUrl
    };

    await updateProfile(updatedUser);
  };

  if (isLoading) return <p className="text-center py-10 text-red-500">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-12">
      <Helmet>
        <title>Blood.net | Donor Profile</title>
      </Helmet>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-gray-200 mb-8">
        <div className="flex items-center gap-5">
          <img
            src={userData.avatar || 'https://i.ibb.co/MBtjqXQ/default-avatar.png'}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-[#E63946] shadow-md"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{userData.name || "Unnamed Donor"}</h2>
            <p className="text-gray-500 text-sm">{userData.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            reset(userData);
            setEditMode(!editMode);
          }}
          className="bg-[#E63946] hover:bg-[#A4161A] text-white px-6 py-2 rounded-lg font-medium transition transform hover:scale-105"
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Full Name</label>
          <input
            type="text"
            defaultValue={userData.name}
            {...register('name', { required: true })}
            disabled={!editMode}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#E63946] focus:outline-none"
          />
          {errors.name && <p className="text-sm text-red-500">Name is required</p>}
        </div>

        {/* Blood Group */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Blood Group</label>
          <input
            type="text"
            defaultValue={userData.bloodGroup}
            {...register('bloodGroup')}
            disabled={!editMode}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#E63946] focus:outline-none"
          />
        </div>

        {/* District */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">District</label>
          <input
            type="text"
            defaultValue={userData.district}
            {...register('district')}
            disabled={!editMode}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#E63946] focus:outline-none"
          />
        </div>

        {/* Upazila */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Upazila</label>
          <input
            type="text"
            defaultValue={userData.upazila}
            {...register('upazila')}
            disabled={!editMode}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#E63946] focus:outline-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Status</label>
          <input
            type="text"
            value={userData.status || 'active'}
            disabled
            className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-500"
          />
        </div>

        {/* Avatar Upload */}
        {editMode && (
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Change Profile Picture</label>
            <input
              type="file"
              {...register('avatar')}
              accept="image/*"
              className="w-full mt-1 text-sm"
            />
          </div>
        )}

        {/* Save Button */}
        {editMode && (
          <div className="col-span-2 mt-4">
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-[#E63946] text-white py-3 rounded-lg font-semibold hover:bg-[#A4161A] transition"
            >
              {uploading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>

  );
};

export default ProfilePage;
