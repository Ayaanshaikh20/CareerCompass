import {
  axiosInstance,
  Link,
  useLocation,
  useNavigate,
  useQuery,
  useQueryClient,
  useState,
  useEffect,
} from "../shared/Imports";
import {
  AccountCircleIcon,
  compass,
  DashboardIcon,
  LogoutIcon,
  MdPushPin,
  WorkIcon,
  LightModeIcon,
  DarkModeIcon,
  SettingsIcon,
} from "../shared/Icons";

const Sidebar = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("isDark") === "true",
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("isDark", newTheme);
    window.dispatchEvent(new Event("storage"));
  };

  const { data: user } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => queryClient.getQueryData(["userDetails"]),
    enabled: false,
  });
  const { data: isPinned } = useQuery({
    queryKey: ["isPinned"],
    queryFn: () => queryClient.getQueryData(["isPinned"]) || false,
    initialData: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

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
    await axiosInstance.post("/logout");
    localStorage.clear();
    queryClient.clear();
    navigate("/");
  };

  return (
    <aside
      className={`bg-white dark:bg-gray-900 flex flex-col font-sans border-r border-gray-200 dark:border-gray-700
    h-screen transition-all duration-800 ease-in-out
    ${isCollapsed && !isPinned ? "w-14" : "w-60"}`}
      onMouseEnter={() => !isPinned && setIsCollapsed(false)}
      onMouseLeave={() => !isPinned && setIsCollapsed(true)}
    >
      {/* Top Section */}
      <div className="flex-1">
        {/* Logo */}
        <div className={`flex ${!isCollapsed ? "justify-between" : "justify-center"} border-b items-center px-3 py-2 border-gray-200 dark:border-gray-700`}>
          <h1 className="font-semibold text-xs flex items-center gap-1.5 text-gray-900 dark:text-gray-100">
            <span className=" py-2">
              <img src={compass} className="h-4 w-4" />
            </span>
            {(!isCollapsed || isPinned) && "CareerCompass"}
          </h1>
          {(!isCollapsed || isPinned) && (
            <div className="flex items-center">
              <button
                className="px-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                onClick={toggleTheme}
                title={isDark ? "Light mode" : "Dark mode"}
              >
                {isDark ? (
                  <LightModeIcon sx={{ fontSize: 16 }} />
                ) : (
                  <DarkModeIcon sx={{ fontSize: 16 }} />
                )}
              </button>
              <button
                className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                onClick={() =>
                  queryClient.setQueryData(["isPinned"], (prev) => !prev)
                }
                title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
              >
                <MdPushPin
                  size={16}
                  className={isPinned ? "rotate-0" : "rotate-45"}
                />
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
                  title={isCollapsed && !isPinned ? item.name : ""}
                  className={`flex items-center text-xs gap-3 px-2 py-1 rounded-sm transition-all duration-400 ${
                    isActive
                      ? "bg-slate-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-normal"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.icon}
                  {(!isCollapsed || isPinned) && (
                    <span className="text-nowrap">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Logout button */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2 w-full flex justify-center">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full justify-center px-2 py-1 text-xs rounded-sm
      text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isCollapsed && !isPinned ? "Logout" : ""}
        >
          <LogoutIcon fontSize="small" />
          {(!isCollapsed || isPinned) && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
