import { toast, axios } from "../shared/Imports";

const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PROD;

console.log("API_URL", API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
});

let isRefreshing = false;
let refreshPromise = null;

const clearSessionAndRedirect = () => {
  toast.error("Session expired. Please login again.");

  setTimeout(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  }, 1000);
};

const refreshAccessToken = async () => {
  try {
    await axios.post(
      `${API_URL}/refresh-token`,
      {},
      { withCredentials: true },
    );
  } catch (error) {
    const refreshCode = error.response?.data?.code;

    if (
      refreshCode === "REFRESH_TOKEN_EXPIRED" ||
      refreshCode === "REFRESH_TOKEN_MISSING" ||
      refreshCode === "INVALID_REFRESH_TOKEN"
    ) {
      clearSessionAndRedirect();
    }

    throw error;
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const code = error.response?.data?.code;

    const needsRefresh =
      (status === 403 && code === "TOKEN_EXPIRED") ||
      (status === 401 && code === "ACCESS_TOKEN_MISSING");

    if (!needsRefresh) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = refreshAccessToken();

        await refreshPromise;

        refreshPromise = null;
        isRefreshing = false;
      } else {
        await refreshPromise;
      }

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      refreshPromise = null;
      isRefreshing = false;

      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
