import { axios, useState, TextField, Button, Link, useNavigate, toast, useQueryClient, axiosInstance } from "../shared/imports";

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
    try {
      const response = await axiosInstance.post("https://careercompass-bs0j.onrender.com/api/login", formData);
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
      console.log(error.message);
      const { status, message } = error?.response?.data || {};
      toast.error(status ? message : "Error logging in user");
    }
  };

  return (
    <>
      <div className='flex justify-center items-center mt-24'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
          <h2 className='text-2xl font-semibold text-center mb-4'>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <TextField name='email' label='Email *' fullWidth size='small' variant='outlined' value={formData.email} onChange={handleChange} />
            </div>
            <div className='mb-4'>
              <TextField
                name='password'
                label='Password *'
                type='password'
                fullWidth
                size='small'
                variant='outlined'
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className='text-sm mb-4'>
              Don't have an account?{" "}
              <Link to='/register' className='text-blue-500 hover:underline'>
                Register
              </Link>
            </div>
            <Button type='submit' variant='contained' color='primary' fullWidth size='small' className='hover:bg-blue-600 transition'>
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
