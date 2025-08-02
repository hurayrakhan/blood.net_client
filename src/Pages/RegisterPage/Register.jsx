import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Providers/AuthProvider';
import { FcGoogle } from 'react-icons/fc';
import { Fade } from 'react-awesome-reveal';
import { saveUserToDB } from '../../Utilities/saveUser';
import { Helmet } from 'react-helmet-async';


export default function Register() {
  const { createUser, signInWithGoogle, setUser, updateDisplayNameAndPhoto } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const imageHostKey = import.meta.env.VITE_IMAGEBB_API_KEY;

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match!',
        confirmButtonColor: '#E63946',
      });
      return;
    }

    try {
      setUploading(true);

      // 🔺 Upload image to ImageBB
      const imageForm = new FormData();
      imageForm.append('image', data.avatar[0]);

      const imageRes = await fetch(`https://api.imgbb.com/1/upload?key=${imageHostKey}`, {
        method: 'POST',
        body: imageForm,
      });
      const imageData = await imageRes.json();
      const avatarUrl = imageData.data.url;

      // 🔺 Create Firebase User
      const result = await createUser(data.email, data.password);
      const loggedInUser = result.user;

      // 🔺 Update Firebase profile
      await updateDisplayNameAndPhoto(data.name, avatarUrl);

      // 🔺 Build full user info for DB
      const fullUser = {
        name: data.name,
        email: data.email,
        avatar: avatarUrl,
        role: 'donor',
        status: 'active',
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila,
      };

      // 🔺 Save to your backend DB
      await saveUserToDB(fullUser);

      // 🔺 Set to Auth Context
      setUser({ ...loggedInUser, ...fullUser });

      // ✅ Success Alert & Redirect
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: `Welcome, ${data.name} 👋`,
        confirmButtonColor: '#E63946',
      });

      navigate(location.state || '/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message,
        confirmButtonColor: '#E63946',
      });
    } finally {
      setUploading(false);
    }
  };


  const handleGoogleRegister = () => {
  signInWithGoogle()
    .then(async (result) => {
      const user = result.user;

      // Build user object for DB
      const userInfo = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        role: 'donor',
        status: 'active',
        bloodGroup: '', // Optional: let them update later
        district: '',
        upazila: '',
      };

      // Save to database
      await saveUserToDB(userInfo);

      // Set in context
      setUser(user);

      // Notify and redirect
      Swal.fire({
        icon: 'success',
        title: 'Google Sign-Up Successful!',
        text: `Welcome, ${user.displayName || 'User'} 👋`,
        confirmButtonColor: '#E63946',
      });

      navigate(location.state || '/');
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-Up Failed',
        text: error.message,
        confirmButtonColor: '#E63946',
      });
    });
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1FAEE] px-4">

      <Helmet>
        <title>Blood.net | Register</title>
        <meta name="description" content="Create a new Blood.net account to start donating and managing requests." />
      </Helmet>

      <Fade direction="up" triggerOnce>
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl px-10 py-10">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-[#E63946]">
              Blood<span className="text-[#A4161A]">.net</span>
            </h1>
            <p className="text-[#1D1D1D] mt-1 font-medium">Create a new account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1D]">Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
              {errors.name && <p className="text-[#E63946] text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1D]">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
              {errors.email && <p className="text-[#E63946] text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1D]">Password</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
                className="w-full mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
              {errors.password && (
                <p className="text-[#E63946] text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1D]">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword', { required: 'Confirm your password' })}
                className="w-full mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
              {errors.confirmPassword && (
                <p className="text-[#E63946] text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1D]">Blood Group</label>
              <select
                {...register('bloodGroup', { required: true })}
                className="w-full mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1D]">District</label>
              <input
                {...register('district', { required: true })}
                className="w-full mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
            </div>

            {/* Upazila */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1D]">Upazila</label>
              <input
                {...register('upazila', { required: true })}
                className="w-full mt-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              />
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1D]">Avatar</label>
              <input
                type="file"
                {...register('avatar', { required: 'Avatar is required' })}
                accept="image/*"
                className="w-full mt-1 p-3 rounded-md border border-gray-300"
              />
              {errors.avatar && <p className="text-[#E63946] text-sm mt-1">{errors.avatar.message}</p>}
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#E63946] text-white py-3 rounded-md font-semibold hover:bg-[#A4161A] transition"
              >
                {uploading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="my-4 text-center text-gray-500 text-sm">OR</div>

          <button
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center border border-[#E63946] text-[#E63946] font-semibold py-3 rounded-md hover:bg-[#FFEDEE] transition"
          >
            <FcGoogle className="mr-2 text-xl" />
            Sign up with Google
          </button>

          <p className="text-center text-sm text-[#1D1D1D] mt-5">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#E63946] hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </Fade>
    </div>
  );
}
