import { PasswordOutlinedIcon, Img1 } from "../../shared/Icons";
import { useState, toast, useNavigate, useQueryClient, axiosInstance, customToggleLoading, CustomTextField } from "../../shared/Imports";

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
    //validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must be at least 8 characters long contain at least one uppercase letter and one special character", { position: "top-right" });
      return;
    }
    customToggleLoading({ loading: true });
    try {
      const response = await axiosInstance.post("/register", formData);
      const { status } = response.data;
      if (status === 201) {
        const { message, userData } = response.data;
        toast.success(message);
        const { userId } = userData;
        localStorage.setItem("uid", userId);
        queryClient.setQueryData(["userDetails"], userData);
        navigate("/dashboard");
      }
    } catch (error) {
      const { message } = error?.response?.data;
      toast.error(message || "Something went wrong");
    } finally {
      customToggleLoading({ loading: false });
    }
  };

  return (
    <main className="flex h-[calc(100vh-50px)] w-full items-center justify-center bg-background font-sans px-4">
      <div className="flex w-full max-w-7xl flex-col lg:flex-row items-center gap-10">
        {/* Left Section (Image) */}
        <div className="hidden lg:flex w-1/2 justify-center">
          <img src={Img1} alt="Register Illustration" className="w-full max-w-md xl:max-w-lg object-contain" />
        </div>

        {/* Right Section (Form) */}
        <div className="w-full max-w-md rounded-xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl xl:text-4xl font-extrabold text-textPrimary mb-3 text-left">Register here 👋</h1>

          <form onSubmit={handleSubmit} className="flex flex-col w-full mt-4 gap-4 text-sm">
            {/* Firstname */}
            <CustomTextField
              id="firstname"
              name="firstName"
              label="First Name"
              placeholder="First name"
              handleChange={handleChange}
              value={formData.firstName}
              type="text"
              required
            />

            {/* Location */}
            <CustomTextField id="location" name="location" label="Location" placeholder="Location" handleChange={handleChange} value={formData.location} type="text" required />

            {/* Phone */}
            <CustomTextField id="phone" name="phone" label="Phone Number" placeholder="Phone number" handleChange={handleChange} value={formData.phone} type="tel" required />

            {/* Email */}
            <CustomTextField id="email" name="email" label="Email" placeholder="Email" handleChange={handleChange} value={formData.email} type="email" required />

            {/* Password */}
            <CustomTextField
              id="password"
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
              required
              helperText={["At least 8 characters", "One uppercase letter (A–Z)", "One special character (!@#$%^&*)"]}
              adornment={<PasswordOutlinedIcon />}
              value={formData.password}
              handleChange={handleChange}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full py-2.5 text-sm"
            >
              Register
            </button>

            {/* Login link */}
            <div className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                Log in
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;
