import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { updateEmail, updatePassword } from 'firebase/auth';
import { AuthContext } from '../../Providers/AuthProvider';
import axiosSecure from '../../api/axiosSecure';
import { auth } from '../../Auth/firebase.config';
import { Helmet } from 'react-helmet-async';

export default function MyProfilePage() {
  const { user } = useContext(AuthContext);
  const { email: routeEmail } = useParams();
  const profileEmail = routeEmail || user?.email;
  const isOwner = user?.email === profileEmail;
  const imageHostKey = import.meta.env.VITE_IMAGEBB_API_KEY;

  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ['profile', profileEmail],
    queryFn: () => axiosSecure.get(`/users/${encodeURIComponent(profileEmail)}`).then(res => res.data),
    enabled: !!profileEmail
  });

  const mutation = useMutation({
    mutationFn: updated => axiosSecure.patch(`/users/${encodeURIComponent(profileEmail)}`, updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', profileEmail] });
      Swal.fire('Updated!', 'Profile updated successfully.', 'success');
      setEditMode(false);
    },
    onError: () => {
      Swal.fire('Error', 'Update failed', 'error');
    }
  });

  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;

    let avatar = profile.avatar;
    let coverPhoto = profile.coverPhoto;

    const uploadImage = async file => {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imageHostKey}`, {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      return data.data.display_url;
    };

    try {
      setUploading(true);

      // Upload images if changed
      if (form.avatar.files[0]) {
        avatar = await uploadImage(form.avatar.files[0]);
      }
      if (form.coverPhoto.files[0]) {
        coverPhoto = await uploadImage(form.coverPhoto.files[0]);
      }

      // Firebase email/password update
      const newEmail = form.newEmail?.value;
      const newPassword = form.newPassword?.value;

      if (isOwner) {
        if (newEmail && newEmail !== user.email) {
          await updateEmail(auth.currentUser, newEmail);
        }
        if (newPassword && newPassword.length >= 6) {
          await updatePassword(auth.currentUser, newPassword);
        }
      }

      mutation.mutate({
        name: form.name.value,
        district: form.district.value,
        upazila: form.upazila.value,
        bloodGroup: form.bloodGroup.value,
        phone: form.phone.value,
        dob: form.dob.value,
        avatar,
        coverPhoto
      });
    } catch (err) {
      Swal.fire('Error', err.message || 'Update failed');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div>

      <Helmet>
        <title>Blood.net | Donor Profile</title>
        <meta name="description" content="View detailed public profile of our dedicated donor, including availability, blood group, and donation history." />
      </Helmet>

      {/* Cover Photo */}
      <div className="relative h-60 bg-gray-200">
        <img
          src={profile.coverPhoto || '/default-cover.jpg'}
          alt="Cover"
          className="w-full h-full object-cover"
        />

        {/* Avatar */}
        <div className="absolute bottom-0 left-5 transform translate-y-1/2">
          <img
            src={profile.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      {/* Profile Form/Card */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg -mt-16 shadow z-10 relative">
        {isOwner && editMode ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Change Avatar</label>
                <input type="file" name="avatar" accept="image/*" />
              </div>
              <div>
                <label>Change Cover</label>
                <input type="file" name="coverPhoto" accept="image/*" />
              </div>
            </div>

            <div>
              <label>Name</label>
              <input name="name" defaultValue={profile.name} className="w-full border p-2 rounded" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>District</label>
                <input name="district" defaultValue={profile.district} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label>Upazila</label>
                <input name="upazila" defaultValue={profile.upazila} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label>Blood Group</label>
                <input name="bloodGroup" defaultValue={profile.bloodGroup} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label>Phone</label>
                <input name="phone" defaultValue={profile.phone} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label>Date of Birth</label>
                <input type="date" name="dob" defaultValue={profile.dob} className="w-full border p-2 rounded" />
              </div>
            </div>

            {/* Firebase Auth Update */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>New Email</label>
                <input type="email" name="newEmail" className="w-full border p-2 rounded" />
              </div>
              <div>
                <label>New Password</label>
                <input type="password" name="newPassword" className="w-full border p-2 rounded" />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-[#E63946] hover:bg-[#A4161A] text-white px-4 py-2 rounded"
              >
                {uploading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-gray-500">{profile.email}</p>
              </div>
              {isOwner && (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-[#E63946] hover:bg-[#A4161A] text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <p><strong>District:</strong> {profile.district}</p>
              <p><strong>Upazila:</strong> {profile.upazila}</p>
              <p><strong>Blood Group:</strong> {profile.bloodGroup}</p>
              <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
              <p><strong>Date of Birth:</strong> {profile.dob || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
