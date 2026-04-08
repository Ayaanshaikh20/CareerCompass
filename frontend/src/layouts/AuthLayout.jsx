import { useEffect, useState } from "react";
import { axiosInstance, Outlet, Sidebar, toast, useQueryClient, IconButton, Badge } from "../shared/Imports";
import { NotificationsOutlined, compass } from "../shared/Icons";

const AuthLayout = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("uid");
  const [notificationCount, setNotificationCount] = useState(0);
  
  useEffect(() => {
    fetchUser();
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
      {/* Header */}
      <div className='flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700'>
        <div className="flex items-center gap-1.5">
          <img src={compass} className="h-5 w-5" alt="CareerCompass" />
          <span className=" font-sans font-semibold text-md">CareerCompass</span>
        </div>
        
        <IconButton
          size="small"
          className="text-gray-700 dark:text-gray-300"
          sx={{ color: 'inherit' }}
          onClick={() => setNotificationCount(0)}
        >
          <Badge badgeContent={notificationCount} color="error">
            <NotificationsOutlined fontSize="small" />
          </Badge>
        </IconButton>
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
