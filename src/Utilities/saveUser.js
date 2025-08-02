
import axios from 'axios';

export const saveUserToDB = async (userInfo) => {
  try {
    const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users`, userInfo);
    return res.data;
  } catch (error) {
    console.error('Error saving user to DB:', error);
  }
};

