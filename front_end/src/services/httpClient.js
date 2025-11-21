import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://movieview-site-production.up.railway.app';

const httpClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `[API ${error.config?.method?.toUpperCase()} ${error.config?.url}]`,
        error.response.status,
        error.response.data
      );
    } else {
      console.error('Network error while contacting API:', error.message);
    }
    return Promise.reject(error);
  }
);

export default httpClient;

