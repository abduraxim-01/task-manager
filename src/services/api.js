import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Mock network delay to make the demo API feel realistic
api.interceptors.response.use(
  async (response) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
