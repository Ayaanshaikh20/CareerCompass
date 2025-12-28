import { PasswordOutlinedIcon, Img1 } from "../shared/Icons";
import { useState, toast, useNavigate, useQueryClient, axiosInstance, customToggleLoading, CustomTextField, CustomButton } from "../shared/Imports";

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
      const response = await axiosInstance.post("/api/register", formData);
      const { status } = response.data;
      if (status === 201) {
        const { message, userData, accessToken, refreshToken } = response.data;
        const { userId } = userData;
        toast.success(message);
        localStorage.setItem("uid", JSON.stringify(userId));
        localStorage.setItem("r_t", refreshToken);
        localStorage.setItem("a_t", accessToken);
        queryClient.setQueryData(["userDetails"], userData);
        navigate("/dashboard");
      }
    } catch (error) {
      const { data, status } = error?.response;
      if (status) {
        toast.error(data);
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      customToggleLoading({ loading: false });
    }
  };

  return (
    <main className="flex flex-col h-[calc(100vh-50px)] md:flex-row w-full items-center justify-evenly gap-12 bg-background font-sans">
      {/* Left Section (Image) */}
      <div className="w-1/2 md:w-1/2 xl:w-1/4 p-6 hidden lg:flex lg:justify-center">
        <img
          src={Img1}
          alt="Register Illustration"
          className="w-100 max-w-sm md:max-w-sm lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
        />
      </div>
      {/* Right Section (Form) */}
      <div className="w-full max-w-md rounded-xl p-6 md:p-8">
        <h1 className="text-xl md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-extrabold text-textPrimary mb-3 text-left md:text-left">
          Register here 👋
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full mt-10 gap-5 text-sm"
        >
          {/* Firstname */}
          <div>
            <CustomTextField
              id="firstname"
              name="firstName"
              label="First Name"
              placeholder={"First name"}
              handleChange={handleChange}
              value={formData.firstName}
              type="text"
              required
            />
          </div>

          {/* Location */}
          <div>
            <CustomTextField
              id="location"
              name="location"
              label="Location"
              placeholder={"Location"}
              handleChange={handleChange}
              value={formData.location}
              type="text"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <CustomTextField
              id="phone"
              name="phone"
              label="Phone Number"
              placeholder={"Phone number"}
              handleChange={handleChange}
              value={formData.phone}
              type="tel"
              required
            />
          </div>

          {/* Email */}
          <div>
            <CustomTextField
              id="email"
              name="email"
              label="Email"
              placeholder={"Email"}
              handleChange={handleChange}
              value={formData.email}
              type="email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <CustomTextField
              id="password"
              name="password"
              label="Password"
              placeholder={"Password"}
              type="password"
              required
              helperText={[
                "At least 8 characters",
                "One uppercase letter (A–Z)",
                "One special character (!@#$%^&*)",
              ]}
              adornment={<PasswordOutlinedIcon />}
              value={formData.password}
              handleChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <CustomButton
            type="submit"
            variant="primary"
            key="register"
          >
            Register
          </CustomButton>

          {/* Already have an account */}
          <div className="text-center text-gray-400 text-sm mt-2">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 hover:text-blue-400 font-medium transition-colors duration-200"
            >
              Log in
            </a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Register;
