import { CustomTextField, CustomButton, axiosInstance, toast, useState, Link, useSearchParams, useNavigate } from "../../shared/Imports";
import { PasswordOutlinedIcon } from "../../shared/Icons";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordreset, setPasswordReset] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError("");
      setSuccess("");

      if (!token) {
        setError("Invalid or missing reset token.");
        return;
      }

      if (!password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }

      const result = await axiosInstance.post("/reset-password", {
        token,
        password: password,
        confirmPassword: confirmPassword,
      });

      if (result) {
        const { status, message } = result.data;
        if (status === 200) {
          setSuccess(message);
          setPassword("");
          setConfirmPassword("");
          setPasswordReset(true);
          setTimeout(() => {
            navigate("/login");
          }, [2000]);
        }
      }
    } catch (err) {
      const { message } = err?.response?.data || {};
      toast.error(message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center mt-10 justify-center px-4">
      <div className="w-full max-w-md p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Reset Password</h1>
          <p className="mt-2 text-sm">Enter your new password below.</p>
        </div>

        {/* Alerts */}
        {error && <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</div>}

        {success && <div className="mb-4 rounded-md bg-green-500/10 border border-green-500/30 px-4 py-2 text-sm text-green-400">{success}</div>}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <CustomTextField
              handleChange={(e) => setPassword(e.target.value)}
              name="password"
              label="New Password"
              type="password"
              placeholder="New password"
              id="password"
              required
              value={password}
              adornment={<PasswordOutlinedIcon />}
            />

            <CustomTextField
              handleChange={(e) => setConfirmPassword(e.target.value)}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              id="confirmPassword"
              required
              value={confirmPassword}
              adornment={<PasswordOutlinedIcon />}
            />

            <CustomButton type="submit" variant={passwordreset ? "disabled" : "primary"}>
              {"Reset Password"}
            </CustomButton>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
