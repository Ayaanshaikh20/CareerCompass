import { useState, useNavigate, toast, useQueryClient, axiosInstance, customToggleLoading, CustomButton, CustomTextField } from "../shared/Imports";
import { EmailOutlinedIcon, PasswordOutlinedIcon, Img2 } from "../shared/Icons";

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
        localStorage.setItem("a_t", accessToken);
        localStorage.setItem("r_t", refreshToken);
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
    <main className="flex h-[calc(100vh-100px)] flex-col md:flex-row w-full items-center justify-evenly gap-12 bg-background font-sans">
      {/* Left Section */}
      <div className="w-1/2 md:w-1/2 xl:w-1/4 p-6 hidden lg:flex lg:justify-center">
        <img
          src={Img2}
          alt="Login illustration"
          className="w-100 max-w-sm md:max-w-sm lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"
        />
      </div>

      {/* Right Section (Form) */}
      <div className="w-full md:w-1/2 max-w-md rounded-xl p-6 md:p-8">
        <h1 className="text-xl md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-extrabold text-textPrimary mb-3 text-left md:text-left">
          Welcome back 👋
        </h1>
        <p className="text-textSecondary text-sm md:text-md max-w-md lg:text-md 2xl:text-lg text-left md:text-left">
          Sign in to continue exploring your personalized dashboard, track progress, and manage your projects effortlessly.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col mt-10 gap-5 text-sm">
          {/* Email */}
          <div>
            <CustomTextField
              handleChange={handleChange}
              name="email"
              label="Email"
              type="email"
              id={"email"}
              required={true}
              value={formData.email}
              adornment={<EmailOutlinedIcon />}
              key="email"
            />
          </div>

          {/* Password */}
          <div>
            <CustomTextField
              name="password"
              label="Password"
              type="password"
              id={"password"}
              required={true}
              adornment={<PasswordOutlinedIcon />}
              value={formData.password}
              handleChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <CustomButton
            type="submit"
            variant="primary"
            key="register" >
            Sign In
          </CustomButton>
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
