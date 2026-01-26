import { axiosInstance, CustomButton, CustomTextField, customToggleLoading, toast, useQueryClient, useState, useEffect } from "../../shared/Imports";

const Profile = () => {
  const queryClient = useQueryClient();
  const user_id = localStorage.getItem("uid");
  const [user, setUser] = useState({
    location: "",
    firstName: "",
    email: "",
    phone: ""
  });
  const [formChanged, setFormChanged] = useState(false);

  //Destructure userData
  const { firstName, location, phone, email } = user || {};

  useEffect(() => {
    fetchUser()
  }, []);

  const fetchUser = async () => {
    try {
      customToggleLoading({ loading: true })
      const result = await axiosInstance.get(`/fetch-user?userId=${user_id}`);
      const { status, userDetails } = result.data;
      if (status == 200) {
        setUser(userDetails);
      }
    } catch (error) {
      const { data } = error?.response || {};
      toast.error(data || "Error updating user");
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
      const { data } = error?.response || {};
      toast.error(data || "Error updating user");
    } finally {
      customToggleLoading({ loading: false })
    }
  };

  return (
    <>
      <main className=" w-full flex justify-between gap-5 bg-background pt-4 p-3 text-textPrimary min-h-screen">
        {/* Profile section */}
        <section className="bg-surface border border-border flex flex-col justify-between shadow rounded-sm p-6 w-full">
          <div>
            <h2 className="text-xl font-semibold text-textPrimary border-b-2 pb-1 mb-6">
              Complete Profile
            </h2>
            <div className="mt-6 space-y-5">
              <span className=" border-b-2 pb-1 mb-6">Personal Details</span>
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm text-textSecondary mb-1">
                    First Name
                  </label>
                  <CustomTextField
                    value={firstName}
                    name={"firstName"}
                    className="w-full"
                    handleChange={(e) => handleChange(e.target.name, e.target.value)}
                  />
                </div>
                {/* <div className="flex flex-col">
                  <label className="text-sm text-textSecondary mb-1">
                    Last Name
                  </label>
                  <CustomTextField
                    value={lastName}
                    name={"lastname"}
                    className="w-full"
                    handleChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </div> */}
              </div>
              {/* Location */}
              <div className="flex flex-col">
                <label className="text-sm text-textSecondary mb-1">
                  Location
                </label>
                <CustomTextField
                  value={location}
                  name={"location"}
                  className="w-full sm:w-72"
                  handleChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </div>
              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-sm text-textSecondary mb-1">
                  Phone Number
                </label>
                <CustomTextField
                  value={phone}
                  name={"phone"}
                  className="w-full sm:w-72"
                  handleChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </div>
              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm text-textSecondary mb-1">
                  Email
                </label>
                <CustomTextField
                  value={email}
                  name={"email"}
                  className="w-full sm:w-72"
                  handleChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Save Changes Button */}
          <div className="flex justify-end mt-10">
            <CustomButton
              variant={formChanged ? "primary" : "disabled"}
              className=""
              handleClick={submitChanges}
              disabled={!formChanged}
            >
              Save Changes
            </CustomButton>
          </div>
        </section>
        {/* Preview section */}
        <section className=" w-full">
        </section>
      </main>
    </>
  );
};

export default Profile;
