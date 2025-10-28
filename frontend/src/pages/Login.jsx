import { useState, TextField, Button, useNavigate, toast, useQueryClient, axiosInstance, customToggleLoading } from "../shared/imports";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    customToggleLoading({ loading: true });
    try {
      const response = await axiosInstance.post("/api/login", formData);
      const { status } = response.data;
      if (status === 200) {
        const { message, userData, refreshToken, accessToken } = response.data;
        toast.success(message);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));
        queryClient.setQueryData(["user"], userData);
        navigate("/dashboard");
      }
    } catch (error) {
      const { status, message } = error?.response?.data || {};
      toast.error(status ? message : "Error logging in user");
    } finally {
      customToggleLoading({ loading: false });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4 text-white font-sans">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#333] rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Sign in to your account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <TextField
              name="email"
              type="email"
              fullWidth
              size="small"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#121212",
                  borderRadius: "6px",
                  color: "#fff",
                  "& fieldset": {
                    borderColor: "#3f3f46",
                  },
                  "&:hover fieldset": {
                    borderColor: "#6366f1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6366f1",
                  },
                },
                input: { color: "#fff" },
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <TextField
              name="password"
              type="password"
              fullWidth
              size="small"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#121212",
                  borderRadius: "6px",
                  color: "#fff",
                  "& fieldset": {
                    borderColor: "#3f3f46",
                  },
                  "&:hover fieldset": {
                    borderColor: "#6366f1",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6366f1",
                  },
                },
                input: { color: "#fff" },
              }}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#6366f1",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "6px",
              paddingY: "10px",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#4f46e5",
              },
            }}
          >
            Sign In
          </Button>
        </form>

        {/* Extra Links */}
        <div className="mt-6 text-sm text-gray-400 text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-400 hover:underline cursor-pointer"
          >
            Register
          </span>
        </div>
      </div>
    </main>
  );
};

export default Login;
