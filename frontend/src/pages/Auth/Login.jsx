import { useState, useNavigate, toast, useQueryClient, axiosInstance, customToggleLoading, CustomTextField, Link } from "../../shared/Imports";
import { EmailOutlinedIcon, PasswordOutlinedIcon, Img2 } from "../../shared/Icons";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      const response = await axiosInstance.post("/login", formData);
      const { status } = response.data;
      if (status === 200) {
        const { message, userData } = response.data;
        toast.success(message);
        const { userId } = userData;
        localStorage.setItem("uid", userId);
        queryClient.setQueryData(["userDetails"], userData);
        navigate("/dashboard");
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
    } finally {
      customToggleLoading({ loading: false });
    }
  };

  return (
    <main className="flex h-[calc(100vh-50px)] w-full items-center justify-center bg-gray-50 dark:bg-gray-900 font-sans px-4">
      <div className="flex w-full max-w-7xl flex-col lg:flex-row items-center gap-10">
        {/* Left Section */}
        <div className="hidden lg:flex w-1/2 justify-center">
          <img src={Img2} alt="Login illustration" className="w-full max-w-md xl:max-w-lg object-contain" />
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:w-1/2 max-w-md rounded-xl p-6 md:p-8">
          <h1 className="text-xl md:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 text-left md:text-left">Welcome back 👋</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-md max-w-md lg:text-md 2xl:text-lg text-left md:text-left">
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
                placeholder={"Email"}
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
                placeholder={"Password"}
                type="password"
                id={"password"}
                required={true}
                adornment={<PasswordOutlinedIcon />}
                value={formData.password}
                handleChange={handleChange}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">Forgot password? <Link className="text-blue-500 dark:text-blue-400" to={'/forgot-password'} >Click here</Link></span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full py-2.5 text-sm"
            >
              Sign In
            </button>
          </form>

          {/* Extra Links */}
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} className="text-blue-500 dark:text-blue-400 hover:underline cursor-pointer">
              Register
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
