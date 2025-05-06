import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://like-it-api-pre-prod.coak.fr',
  withCredentials: true,
});

export default axiosInstance;
