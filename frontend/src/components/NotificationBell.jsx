import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 focus:outline-none"
        title="Notifications"
      >
        <NotificationsIcon sx={{ fontSize: 20 }} className="transition-transform duration-300 hover:rotate-12" />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-gray-900 animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 z-50 flex flex-col overflow-hidden">
            <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-150 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-xs text-gray-800 dark:text-gray-100">Upcoming Interviews</h3>
              <span className="text-[10px] text-gray-500 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md font-medium">
                {notifications.length} alerts
              </span>
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-gray-500 dark:text-gray-400">
                No upcoming interviews
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.map((notif) => (
                  <div key={notif.id} className="px-4 py-3.5 hover:bg-slate-50/80 dark:hover:bg-gray-800/80 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 p-2 rounded-xl flex items-center justify-center transition-all ${
                        notif.daysLeft === 0 ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400" :
                        notif.daysLeft <= 2 ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400" :
                        "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                      }`}>
                        <CalendarTodayIcon sx={{ fontSize: 14 }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {notif.role}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <BusinessIcon className="text-gray-400 dark:text-gray-500" sx={{ fontSize: 12 }} />
                          <p className="text-[10px] text-gray-500 dark:text-gray-450 truncate">
                            {notif.employer}
                          </p>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md ${
                            notif.daysLeft === 0 ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400" :
                            notif.daysLeft <= 2 ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400" :
                            "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                          }`}>
                            {notif.message}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
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
