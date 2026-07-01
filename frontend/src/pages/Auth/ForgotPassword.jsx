import { Link, CustomTextField, axiosInstance, toast } from "../../shared/Imports";
import { useState } from "react";
import { EmailOutlinedIcon } from "../../shared/Icons";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0); // seconds

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError("");
      setSuccess("");

      if (!email) {
        setError("Please enter your email address.");
        return;
      }

      setLoading(true);

      const result = await axiosInstance.post("/forget-password", { email });

      if (result?.data?.status === 200) {
        setSuccess(result.data.message);
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center mt-10 justify-center px-4">
      <div className="w-full max-w-md p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold ">Forgot Password</h1>
          <p className="mt-2 text-sm ">Enter your email and we’ll send you a reset link.</p>
        </div>

        {/* Alerts */}
        {error && <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</div>}

        {success && <div className="mb-4 rounded-md bg-green-500/10 border border-green-500/30 px-4 py-2 text-sm text-green-400">{success}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <CustomTextField
              handleChange={(e) => setEmail(e.target.value)}
              name="email"
              label="Email"
              type="email"
              placeholder={"Email"}
              id={"email"}
              required={true}
              value={email}
              adornment={<EmailOutlinedIcon />}
              key="email"
            />
          </div>
          <button
            type="submit"
            disabled={cooldown > 0 || loading}
            className={`w-full py-2 rounded font-medium transition-colors ${
              cooldown > 0 || loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
