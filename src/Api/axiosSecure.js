import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Create Axios instance
const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ Update to your backend URL
});

// Request interceptor
axiosSecure.interceptors.request.use(
    async (config) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosSecure;
