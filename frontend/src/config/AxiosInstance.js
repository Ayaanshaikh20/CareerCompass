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

const clearSessionAndRedirect = async () => {
  await axios.post(
    `${axiosInstance.defaults.baseURL}/logout`,
    {},
    { withCredentials: true },
  );
  setTimeout(() => {
    localStorage.removeItem("uid");
    sessionStorage.clear();
    window.location.href = "/";
  }, 1000);
  toast.error("Session expired");
  return Promise.reject({
    customSessionExpired: true,
    originalError: error,
  });
};

// Response interceptor to refresh token on 401 or 403
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const { code } = error.response?.data || {};

    //If access token is missing, it means user has no valid session, so log them out and redirect to login page
    // if (code === "ACCESS_TOKEN_MISSING") {
    //   clearSessionAndRedirect();
    //   return;
    // }
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
