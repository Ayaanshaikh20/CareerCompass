import { useEffect } from "react";
import { axiosInstance, Outlet, Sidebar, toast, useQueryClient } from "../shared/Imports";

const AuthLayout = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("uid");
  
  useEffect(() => {
    fetchUser()
  }, []);

  const fetchUser = async () => {
    try {
      const result = await axiosInstance.get(`/api/fetch-user?userId=${userId}`);
      const { status, userDetails } = result.data;
      if (status == 200) {
        queryClient.setQueryData(["userDetails"], userDetails)
      }
    } catch (error) {
      const { data } = error?.response || {};
      toast.error(data || "Error updating user");
    }
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <div className='w-full overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
