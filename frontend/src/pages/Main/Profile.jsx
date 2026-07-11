import { axiosInstance, CustomTextField, customToggleLoading, toast, useQueryClient, useState, useEffect } from "../../shared/Imports";

const Profile = () => {
  const queryClient = useQueryClient();
  const user_id = localStorage.getItem("uid");
  const [user, setUser] = useState({
    location: "",
    firstName: "",
    email: "",
    phone: "",
    plan: null,
    analysesUsed: 0
  });
  const [formChanged, setFormChanged] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem("isDark") === "true");

  useEffect(() => {
    const handleStorageChange = () => {
      setIsDark(localStorage.getItem("isDark") === "true");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  //Destructure userData
  const { firstName, location, phone, email, plan, analysesUsed } = user || {};

  useEffect(() => {
    fetchUser()
  }, []);

  const fetchUser = async () => {
    try {
      customToggleLoading({ loading: true })
      const result = await axiosInstance.get(`/fetch-user`);
      const { status, userDetails } = result.data;
      if (status == 200) {
        setUser(userDetails);
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
    } finally {
      customToggleLoading({ loading: false })
    }
  };

  const handleChange = (name, value) => {
    setUser((prev) => {
      return {
        ...prev,
        [name]: value
      }
    });
    setFormChanged(true)
  };

  const submitChanges = async () => {
    try {
      customToggleLoading({ loading: true });
      const result = await axiosInstance.post("/edit-profile", user)
      const { status, message } = result.data;
      if (status == 200) {
        toast.success(message);
        queryClient.setQueryData(["userDetails"], user);
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
    } finally {
      customToggleLoading({ loading: false })
    }
  };

  return (
    <main className="w-full bg-gray-50 dark:bg-gray-950 p-2 sm:p-4 min-h-full">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Plan Section */}
        {plan && (
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-800 shadow-sm rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Current Plan
                  </h2>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white uppercase">
                    {plan}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {plan === 'FREE' && 'Free Trial - Get started with basic features'}
                  {plan === 'PRO' && 'Pro Plan - Advanced features for professionals'}
                  {plan === 'PREMIUM' && 'Premium Plan - All features unlocked'}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-lg border border-blue-200 dark:border-gray-600 min-w-[140px]">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Resume Analyses</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analysesUsed || 0}
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-normal"> / {plan === 'FREE' ? 5 : plan === 'PRO' ? 50 : 200}</span>
                </div>
              </div>
            </div>

            {/* Plan Features */}
            <div className="mt-6 pt-6 border-t border-blue-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Plan Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan === 'FREE' && (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">10 resume analyses per month</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">Job description matching</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">Basic skill recommendations</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">Application tracking</span>
                    </div>
                  </>
                )}
                {plan === 'PRO' && (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">50 resume analyses per month</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">Advanced AI insights</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">Priority support</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">Custom templates</span>
                    </div>
                  </>
                )}
                {plan === 'PREMIUM' && (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">200 resume analyses per month</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">Unlimited job tracking</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">Dedicated account manager</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">API access</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Profile Settings Section */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pb-3 mb-6 border-b border-gray-200 dark:border-gray-700">
            Profile Settings
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                      First Name
                    </label>
                    <CustomTextField
                      value={firstName}
                      name="firstName"
                      className="w-full"
                      handleChange={(e) => handleChange(e.target.name, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                      Email
                    </label>
                    <CustomTextField
                      value={email}
                      name="email"
                      type="email"
                      className="w-full"
                      handleChange={(e) => handleChange(e.target.name, e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                      Phone Number
                    </label>
                    <CustomTextField
                      value={phone}
                      name="phone"
                      type="tel"
                      className="w-full"
                      handleChange={(e) => handleChange(e.target.name, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                      Location
                    </label>
                    <CustomTextField
                      value={location}
                      name="location"
                      className="w-full"
                      handleChange={(e) => handleChange(e.target.name, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                fetchUser();
                setFormChanged(false);
              }}
              disabled={!formChanged}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${formChanged
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-gray-200 dark:border-gray-700"
                }`}
            >
              Cancel
            </button>
            <button
              onClick={submitChanges}
              disabled={!formChanged}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${formChanged
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                }`}
            >
              Save Changes
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;
