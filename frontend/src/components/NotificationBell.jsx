import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import { axiosInstance } from "../shared/Imports";
import dayjs from "dayjs";

const NotificationBell = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/notifications`);
      return res.data.notifications;
    },
    refetchInterval: 30000,
  });

  const notifications = data || [];

  return (
    <div className="relative">
      <IconButton size="small" onClick={() => setIsOpen(!isOpen)}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon fontSize="small" className="text-gray-700 dark:text-gray-300" />
        </Badge>
      </IconButton>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 flex flex-col max-h-96">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Upcoming Interviews</h3>
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No upcoming interviews
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-48 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-2 rounded-full flex items-center justify-center ${notif.daysLeft === 0 ? "bg-red-100 dark:bg-red-900" :
                          notif.daysLeft <= 2 ? "bg-orange-100 dark:bg-orange-900" :
                            "bg-blue-100 dark:bg-blue-900"
                        }`}>
                        <CalendarTodayIcon className={`${notif.daysLeft === 0 ? "text-red-600 dark:text-red-400" :
                            notif.daysLeft <= 2 ? "text-orange-600 dark:text-orange-400" :
                              "text-blue-600 dark:text-blue-400"
                          }`} sx={{ fontSize: 16 }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {notif.role}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <BusinessIcon className="text-gray-400" sx={{ fontSize: 12 }} />
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {notif.employer}
                          </p>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className={`text-xs font-medium ${notif.daysLeft === 0 ? "text-red-600 dark:text-red-400" :
                              notif.daysLeft <= 2 ? "text-orange-600 dark:text-orange-400" :
                                "text-blue-600 dark:text-blue-400"
                            }`}>
                            {notif.message}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {dayjs(notif.interviewDate).format("MMM D")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
