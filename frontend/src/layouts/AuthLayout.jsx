import { useEffect, useState } from "react";
import { axiosInstance, Outlet, Sidebar, toast, useQueryClient, NotificationBell, useNavigate } from "../shared/Imports";
import { compass } from "../shared/Icons";
import { Menu as MenuIcon } from "@mui/icons-material";

const AuthLayout = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("uid");
  const navigate = useNavigate();

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
    <div className='flex flex-col h-screen bg-slate-200/60 dark:bg-gray-950'>
      {/* Header */}
      <div className='sticky top-0 z-40 flex items-center justify-between px-3 sm:px-4 py-0.5 bg-slate-50 dark:bg-gray-900 border-b border-slate-300 dark:border-gray-800 transition-colors duration-200 shadow-sm'>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('toggleMobileSidebar'))}
            className="md:hidden p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mr-1"
          >
            <MenuIcon sx={{ fontSize: 20 }} />
          </button>

          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="p-0.5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 rounded-md border border-blue-100 dark:border-indigo-900/50 shadow-sm group-hover:shadow transition-all duration-300">
              <img src={compass} className="h-4 w-4 group-hover:rotate-[15deg] transition-transform duration-300 ease-out" alt="CareerCompassLogo" />
            </div>
            <span className="font-sans font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              CareerCompass
            </span>
          </div>
        </div>

        {userId && <NotificationBell userId={userId} />}
      </div>
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <div className='flex-1 min-w-0 overflow-y-auto bg-slate-200/60 dark:bg-gray-950'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
