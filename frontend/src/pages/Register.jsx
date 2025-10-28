import { useState, TextField, Button, toast, useNavigate, useQueryClient, axiosInstance, customToggleLoading } from "../shared/imports";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    location: "",
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
      const response = await axiosInstance.post("/api/register", formData);
      const { status } = response.data;
      if (status === 201) {
        const { message, userData, accessToken, refreshToken } = response.data;
        toast.success(message);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("accessToken", accessToken);
        queryClient.setQueryData(["user"], userData);
        navigate("/dashboard");
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.status) {
        toast.error(errorData.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      customToggleLoading({ loading: false });
    }
  };

  return (
    <main className="flex items-center justify-center h-[calc(100vh-70px)] px-4 text-white font-sans">
      <div className="w-full max-w-md rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-black mb-3 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm text-gray-200">
          {/* Firstname */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-black mb-1">Firstname</label>
            <TextField
              id="firstName"
              name="firstName"
              variant="outlined"
              size="small"
              fullWidth
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-black mb-1">Location</label>
            <TextField
              id="location"
              name="location"
              variant="outlined"
              size="small"
              fullWidth
              required
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">Phone Number</label>
            <TextField
              id="phone"
              name="phone"
              type="tel"
              size="small"
              fullWidth
              required
              inputProps={{
                minLength: 10,
                maxLength: 10,
                inputMode: "numeric",
                pattern: "\\d{10}",
              }}
              helperText="Phone number must be 10 digits"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">Email</label>
            <TextField
              id="email"
              name="email"
              type="email"
              size="small"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-1">Password</label>
            <TextField
              id="password"
              name="password"
              type="password"
              size="small"
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            size="small"
            className="primary-button"
            fullWidth
          >
            Register
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Register;
