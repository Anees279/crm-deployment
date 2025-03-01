import axios from 'axios';

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const response = await axios.post('/api/auth/login', data);
  return response.data;
};
