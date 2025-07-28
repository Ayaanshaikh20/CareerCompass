import { useState, TextField, Button, toast, useNavigate, useQueryClient, axiosInstance } from "../shared/imports";

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
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4 text-white font-sans">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#333] rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-white mb-3 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm text-gray-200">
          {/* Firstname */}
          <div>
            <label htmlFor="firstName" className="block mb-1">Firstname</label>
            <TextField
              id="firstName"
              name="firstName"
              variant="outlined"
              size="small"
              fullWidth
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your name"
              InputLabelProps={{ shrink: false }}
              InputProps={{
                style: {
                  color: "white",
                  backgroundColor: "#121212",
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: "#444" },
                  '&:hover fieldset': { borderColor: "#888" },
                  '&.Mui-focused fieldset': { borderColor: "#1976d2" },
                },
              }}
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block mb-1">Location</label>
            <TextField
              id="location"
              name="location"
              variant="outlined"
              size="small"
              fullWidth
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your location"
              InputLabelProps={{ shrink: false }}
              InputProps={{
                style: {
                  color: "white",
                  backgroundColor: "#121212",
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: "#444" },
                  '&:hover fieldset': { borderColor: "#888" },
                  '&.Mui-focused fieldset': { borderColor: "#1976d2" },
                },
              }}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block mb-1">Phone Number</label>
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
              placeholder="Enter your phone"
              InputLabelProps={{ shrink: false }}
              InputProps={{
                style: {
                  color: "white",
                  backgroundColor: "#121212",
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: "#444" },
                  '&:hover fieldset': { borderColor: "#888" },
                  '&.Mui-focused fieldset': { borderColor: "#1976d2" },
                },
                '& .MuiFormHelperText-root': {
                  color: "#aaa",
                  fontSize: "0.75rem",
                },
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <TextField
              id="email"
              name="email"
              type="email"
              size="small"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              InputLabelProps={{ shrink: false }}
              InputProps={{
                style: {
                  color: "white",
                  backgroundColor: "#121212",
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: "#444" },
                  '&:hover fieldset': { borderColor: "#888" },
                  '&.Mui-focused fieldset': { borderColor: "#1976d2" },
                },
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1">Password</label>
            <TextField
              id="password"
              name="password"
              type="password"
              size="small"
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              InputLabelProps={{ shrink: false }}
              InputProps={{
                style: {
                  color: "white",
                  backgroundColor: "#121212",
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: "#444" },
                  '&:hover fieldset': { borderColor: "#888" },
                  '&.Mui-focused fieldset': { borderColor: "#1976d2" },
                },
              }}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            size="small"
            fullWidth
            sx={{
              mt: 1,
              bgcolor: "#1976d2",
              color: "#fff",
              textTransform: "none",
              '&:hover': {
                bgcolor: "#1565c0",
              },
            }}
          >
            Register
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Register;
