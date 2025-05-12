import axios from "axios";
import toast from "react-hot-toast";

export const handleTokenExpiryAndRetry = async (
  error,
  navigate,
  queryClient
) => {
  if (error.response && error.response.status === 403) {
    try {
      const refreshRes = await axios.post("/api/new-access-token", {
        token: JSON.parse(localStorage.getItem("user"))?.refreshToken,
      });

      const { accessToken: newAccessToken } = refreshRes.data;

      // Update token in local storage
      const user = JSON.parse(localStorage.getItem("user"));
      user.accessToken = newAccessToken;
      localStorage.setItem("user", JSON.stringify(user));

      return newAccessToken;
    } catch (refreshError) {
      if (refreshError.response.status === 403) {
        toast.error("Session expired. Please log in again.");
        navigate("/");
        localStorage.clear();
        queryClient.setQueryData(["user"], null);
        return "Expired refresh token"
      }
    }
  }
};
