import { useEffect, useState } from "react";
import { axiosInstance, Outlet, Sidebar, toast, useQueryClient, NotificationBell } from "../shared/Imports";
import { compass } from "../shared/Icons";
import { Menu as MenuIcon } from "@mui/icons-material";

const AuthLayout = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("uid");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const result = await axiosInstance.get(`/fetch-user`);
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
      {/* Header */}
      <div className='flex items-center justify-between px-3 sm:px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700'>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('toggleMobileSidebar'))}
            className="md:hidden p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors mr-2"
          >
            <MenuIcon sx={{ fontSize: 20 }} />
          </button>
          <img src={compass} className="h-5 w-5" alt="CareerCompass" />
          <span className="font-sans font-semibold text-sm sm:text-md">CareerCompass</span>
        </div>

        {userId && <NotificationBell userId={userId} />}
      </div>
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
