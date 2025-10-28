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
    <main className="flex w-full justify-center items-center px-4 text-black font-sans h-[calc(100vh-70px)]">
      <div className="flex flex-col w-full max-w-md justify-center border rounded-xl shadow-lg p-8 bg-white">
        <h1 className="text-2xl font-bold text-black mb-6">
          Sign in
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Email</label>
            <TextField
              name="email"
              type="email"
              fullWidth
              size="small"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Password</label>
            <TextField
              name="password"
              type="password"
              fullWidth
              size="small"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <Button
            className="primary-button"
            type="submit"
            variant="contained"
            fullWidth
          >
            Sign In
          </Button>
        </form>
        <div className="mt-6 text-sm text-gray-400 text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Register
          </span>
        </div>
      </div>
    </main>

  );
};

export default Login;
