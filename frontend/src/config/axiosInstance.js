import { toast, axios } from "../shared/Imports";

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV == "production" ? import.meta.env.VITE_PRODUCTION_URL : import.meta.env.VITE_LOCAL_API,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

console.log(process.env.NODE_ENV == "production" ? import.meta.env.VITE_PRODUCTION_URL : import.meta.env.VITE_LOCAL_API)

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("a_t");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error)
  }
);

// Response interceptor to refresh token on 403
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;

    if (status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("r_t");
      try {
        const res = await axios.post("/api/refresh-token", {
          token: refreshToken,
        });

        const { accessToken: newAccessToken } = res.data;

        localStorage.setItem("a_t", newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

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
        });
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
