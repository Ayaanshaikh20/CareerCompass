import axios from "axios";
import toast from "react-hot-toast";

export const handleTokenExpiryAndRetry = async ({ error, retryCallback }) => {
  if (error.response && error.response.status === 403) {
    try {
      const refreshRes = await axios.post("/api/refresh-token", {
        token: JSON.parse(localStorage.getItem("user"))?.refreshToken,
      });

      const { accessToken: newAccessToken } = refreshRes.data;

      // Update token in local storage
      const user = JSON.parse(localStorage.getItem("user"));
      user.accessToken = newAccessToken;
      localStorage.setItem("user", JSON.stringify(user));

      // Retry the original request
      return await retryCallback(newAccessToken);
    } catch (refreshError) {
      if (refreshError.response.status === 403) {
        const { message } = refreshError.response.data;
        toast.error("Session expired. Please log in again.");
        return message;
      }
    }
  } else {
    toast.error("Error creating new application");
    throw error;
  }
};
