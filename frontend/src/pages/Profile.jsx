import { axiosInstance, CustomButton, CustomTextField, useState } from "../shared/Imports";

const Profile = () => {
  const { first_name, last_name, location, phone_number, email } = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState({
    personalDetails: {
      firstName: first_name,
      lastName: last_name,
      location: location,
      phone: phone_number,
      email: email
    },
    experience: [],
    education: [],
    skills: [],
    resume: null
  });
  const [formChanged, setFormChanged] = useState(false);

  //Destructure userData
  const { personalDetails } = userData;
  const { firstName, lastName, location: address, phone, email: emailId } = personalDetails;

  const handleChange = (name, value, section) => {
    setUserData((prevData) => {
      return {
        ...prevData,
        [section]: {
          ...prevData[section],
          [name]: value
        }
      }
    });
    setFormChanged(true)
  };

  const submitChanges = async () => {
    try {
      let result = await axiosInstance.post("/api/edit-profile", userData)
      console.log(result, 'result');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <main className=" w-full flex justify-between gap-5 bg-background pt-12 p-6 text-textPrimary min-h-screen">
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
                    name={"firstname"}
                    className="w-full"
                    handleChange={(e) => handleChange("firstName", e.target.value, "personalDetails")}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-textSecondary mb-1">
                    Last Name
                  </label>
                  <CustomTextField
                    value={lastName}
                    name={"lastname"}
                    className="w-full"
                    handleChange={(e) => handleChange("lastName", e.target.value, "personalDetails")}
                  />
                </div>
              </div>
              {/* Location */}
              <div className="flex flex-col">
                <label className="text-sm text-textSecondary mb-1">
                  Location
                </label>
                <CustomTextField
                  value={address}
                  className="w-full sm:w-72"
                  handleChange={(e) => handleChange("location", e.target.value, "personalDetails")}
                />
              </div>
              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-sm text-textSecondary mb-1">
                  Phone Number
                </label>
                <CustomTextField
                  value={phone}
                  className="w-full sm:w-72"
                  handleChange={(e) => handleChange("phone", e.target.value, "personalDetails")}
                />
              </div>
              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm text-textSecondary mb-1">
                  Email
                </label>
                <CustomTextField
                  value={emailId}
                  className="w-full sm:w-72"
                  handleChange={(e) => handleChange("email", e.target.value, "personalDetails")}
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
