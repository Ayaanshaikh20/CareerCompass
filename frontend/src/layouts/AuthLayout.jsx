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
      const result = await axiosInstance.get(`/fetch-user?userId=${userId}`);
      const { status, userDetails } = result.data;
      if (status == 200) {
        queryClient.setQueryData(["userDetails"], userDetails)
      }
    } catch (error) {
      const { message } = error?.response?.data || {};
      toast.error(message || "Something went wrong");
    }
  };

  return (
    <div className='flex flex-col h-screen bg-gray-50 dark:bg-gray-950'>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <div className='w-full overflow-y-auto bg-gray-50 dark:bg-gray-950'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
