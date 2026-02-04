import { toast, axios } from "../shared/Imports";

const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PROD;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 10 seconds timeout
});

// Response interceptor to refresh token on 403
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    
    // retry new token
    if (status === 403 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        await axios.post(`${axiosInstance.defaults.baseURL}/refresh-token`, {}, { withCredentials: true });
        return axiosInstance(originalRequest);
      } catch (error) {
        toast.error("Session expired");
        //logout user after short delay call api to clear cookies
        await axios.post(`${axiosInstance.defaults.baseURL}/logout`, {}, { withCredentials: true });
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/login";
        }, [1500]);
        return Promise.reject({
          customSessionExpired: true,
          originalError: err,
        });
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
