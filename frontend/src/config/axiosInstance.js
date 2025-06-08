import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to refresh token on 403
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;

    if (status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      try {
        const res = await axios.post("/api/refresh-token", {
          token: refreshToken,
        });

        const { accessToken: newAccessToken } = res.data;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        toast.error("Session expired");
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/login";
        }, [1500]);
        return Promise.reject({
          customSessionExpired: true,
          originalError: err,
        });;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
