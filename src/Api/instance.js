import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // set this in .env
  withCredentials: true, // for sending cookies (JWT token)
});

// (optional) You can add interceptors here later for token auto-injection
export default instance;