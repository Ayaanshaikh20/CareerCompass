import {
  axiosInstance,
  Link,
  useLocation,
  useNavigate,
  useQueryClient,
  useState,
} from "../shared/Imports";
import {
  AccountCircleIcon,
  compass,
  DashboardIcon,
  LogoutIcon,
  WorkIcon,
  SettingsIcon,
  BusinessIcon,
} from "../shared/Icons";
import { Menu as MenuIcon } from "@mui/icons-material";

const Sidebar = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      name: "Applications",
      path: "/applications",
      icon: <WorkIcon fontSize="small" />,
    },
    {
      name: "Companies",
      path: "/companies",
      icon: <BusinessIcon fontSize="small" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <AccountCircleIcon fontSize="small" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <SettingsIcon fontSize="small" />,
    },
  ];

  const handleLogout = async () => {
    const isDark = localStorage.getItem("isDark");
    await axiosInstance.post("/logout");
    localStorage.clear();
    if (isDark) localStorage.setItem("isDark", isDark);
    queryClient.clear();
    navigate("/");
  };

  return (
    <aside
      className={`bg-white dark:bg-gray-900 flex flex-col font-sans border-r border-gray-300 dark:border-gray-700
    h-screen transition-all duration-300 ease-in-out
    ${isCollapsed ? "w-14" : "w-60"}`}
    >
      {/* Top Section */}
      <div className="flex-1">
        {/* Logo */}
        <div
          className={`flex ${!isCollapsed ? "justify-end" : "justify-center"} border-b items-center px-3 py-1 border-gray-300 dark:border-gray-700`}
        >
          {!isCollapsed ? (
            <div className="flex items-center">
              <button
                className=" px-1 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 rounded transition-colors"
                onClick={() => setIsCollapsed(true)}
                title="Collapse sidebar"
              >
                <MenuIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <button
                className="px-1 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 rounded transition-colors"
                onClick={() => setIsCollapsed(false)}
                title="Expand sidebar"
              >
                <MenuIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
          )}
        </div>
        {/* Menu */}
        <ul className="p-2 space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  title={isCollapsed ? item.name : ""}
                  className={`flex items-center text-xs gap-3 px-2 py-1 rounded-sm transition-all duration-400 ${
                    isActive
                      ? "bg-slate-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 font-normal"
                      : "hover:bg-gray-300 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className="text-nowrap">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Logout button */}
      <div className="border-t border-gray-300 dark:border-gray-700 p-2 w-full flex justify-center">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full justify-center px-2 py-1 text-xs rounded-sm
      text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
          title={isCollapsed ? "Logout" : ""}
        >
          <LogoutIcon fontSize="small" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
