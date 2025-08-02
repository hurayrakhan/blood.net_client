import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Providers/AuthProvider';
import { FcGoogle } from 'react-icons/fc';
import { Fade } from 'react-awesome-reveal';
import { saveUserToDB } from '../../Utilities/saveUser';
import { Helmet } from 'react-helmet-async';

export default function Login() {
  const { signIn, signInWithGoogle, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then(async (result) => {
        const loggedInUser = result.user;

        setUser(loggedInUser);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome, ${loggedInUser.displayName || 'User'} 👋`,
          confirmButtonColor: '#E63946',
        });

        navigate(location.state || '/');
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message,
          confirmButtonColor: '#E63946',
        });
      });
  };


  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then(async (result) => {
        const loggedInUser = result.user;

        // Save/update user info to DB
        await saveUserToDB({
          name: loggedInUser.displayName,
          email: loggedInUser.email,
          avatar: loggedInUser.photoURL,
          role: 'donor',
          status: 'active',
          bloodGroup: '',  // leave blank on login
          district: '',
          upazila: ''
        });

        setUser(loggedInUser);

        Swal.fire({
          icon: 'success',
          title: 'Google Login Successful!',
          text: `Welcome, ${loggedInUser.displayName || 'User'} 👋`,
          confirmButtonColor: '#E63946',
        });

        navigate(location.state || '/');
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Google Login Failed',
          text: error.message,
          confirmButtonColor: '#E63946',
        });
      });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1FAEE] px-4">

      <Helmet>
        <title>Blood.net | Login</title>
        <meta name="description" content="Login to your Blood.net account to access donor and admin dashboards." />
      </Helmet>

      <Fade direction="up" triggerOnce>
        <div className="w-md bg-white shadow-lg rounded-2xl px-8 py-10">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-[#E63946]">
              Blood<span className="text-[#A4161A]">.net</span>
            </h1>
            <p className="text-[#1D1D1D] mt-1 font-medium">Please login to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1D1D1D]">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className={`w-full mt-1 p-3 rounded-md border ${errors.email ? 'border-[#E63946]' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#E63946]`}
              />
              {errors.email && (
                <p className="text-[#E63946] text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1D1D1D]">Password</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
                className={`w-full mt-1 p-3 rounded-md border ${errors.password ? 'border-[#E63946]' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#E63946]`}
              />
              {errors.password && (
                <p className="text-[#E63946] text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#E63946] text-white py-3 rounded-md font-semibold hover:bg-[#A4161A] transition"
            >
              Login
            </button>
          </form>

          <div className="my-4 text-center text-gray-500 text-sm">OR</div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border border-[#E63946] text-[#E63946] font-semibold py-3 rounded-md hover:bg-[#FFEDEE] transition"
          >
            <FcGoogle className="mr-2 text-xl" />
            Sign in with Google
          </button>

          <p className="text-center text-sm text-[#1D1D1D] mt-5">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="text-[#E63946] hover:underline font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </Fade>
    </div>
  );
}
