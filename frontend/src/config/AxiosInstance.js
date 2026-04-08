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

let isSessionExpired = false;

const clearSessionAndRedirect = async () => {
  if (isSessionExpired) return Promise.reject({ customSessionExpired: true });
  
  isSessionExpired = true;
  toast.error("Session expired");
  
  await axios.post(
    `${axiosInstance.defaults.baseURL}/logout`,
    {},
    { withCredentials: true },
  ).catch(() => {});
  
  setTimeout(() => {
    localStorage.removeItem("uid");
    sessionStorage.clear();
    window.location.href = "/";
  }, 1000);
  
  return Promise.reject({ customSessionExpired: true });
};

// Response interceptor to refresh token on 401 or 403
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const { code } = error.response?.data || {};

    // retry new token on 403 (expired token)
    if ((code === "ACCESS_TOKEN_MISSING" || status === 403) && !originalRequest._retry) {
      try {
        originalRequest._retry = true;
        await axios.post(
          `${axiosInstance.defaults.baseURL}/refresh-token`,
          {},
          { withCredentials: true },
        );
        return axiosInstance(originalRequest);
      } catch (error) {
        clearSessionAndRedirect();
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
