import {
  axiosInstance,
  Link,
  useLocation,
  useNavigate,
  useQueryClient,
  useState,
  useEffect,
} from "../shared/Imports";
import {
  AccountCircleIcon,
  compass,
  DashboardIcon,
  LogoutIcon,
  WorkIcon,
  SettingsIcon,
  BusinessIcon,
  FolderIcon,
  AssessmentIcon,
  DocumentScannerIcon
} from "../shared/Icons";
import { Menu as MenuIcon, ExpandMore, ExpandLess } from "@mui/icons-material";

const Sidebar = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userPlan, setUserPlan] = useState(null);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const user_id = localStorage.getItem("uid");

  useEffect(() => {
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    try {
      const response = await axiosInstance.get(`/fetch-user`);
      const { userDetails } = response.data;
      setUserPlan(userDetails.plan || null);
    } catch (error) {
      console.error(error);
    }
  };

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
      name: "Documents",
      path: "/documents",
      icon: <FolderIcon fontSize="small" />,
    },
    {
      name: "Resume Analyzer",
      path: "/resume-analyzer",
      icon: <DocumentScannerIcon fontSize="small" />,
    },
    {
      name: "Manage Plan",
      path: "/manage-plan",
      icon: <AssessmentIcon fontSize="small" />,
    },
  ];

  const settingsItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: <AccountCircleIcon fontSize="small" />,
      badge: userPlan,
    },
    {
      name: "Preferences",
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

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen(!isMobileOpen);
    window.addEventListener('toggleMobileSidebar', handleToggle);
    return () => window.removeEventListener('toggleMobileSidebar', handleToggle);
  }, [isMobileOpen]);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`bg-slate-50 dark:bg-gray-900 flex flex-col justify-between font-sans border-r border-slate-300 dark:border-gray-800
    h-full transition-all duration-300 ease-in-out
    fixed md:static z-50 md:z-auto
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    ${isCollapsed ? "w-14" : "w-52"}`}
      >
        {/* Top Section */}
        <div className="">
          {/* Logo */}
          <div
            className={`flex ${!isCollapsed ? "justify-end" : "justify-center"} border-b items-center px-2 py-1 border-slate-300 dark:border-gray-800`}
          >
            {!isCollapsed ? (
              <div className="flex items-center">
                <button
                  className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors hidden md:block"
                  onClick={() => setIsCollapsed(true)}
                  title="Collapse sidebar"
                >
                  <MenuIcon sx={{ fontSize: 16 }} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <button
                  className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors hidden md:block"
                  onClick={() => setIsCollapsed(false)}
                  title="Expand sidebar"
                >
                  <MenuIcon sx={{ fontSize: 16 }} />
                </button>
              </div>
            )}
          </div>
          {/* Menu */}
          <ul className={`${isCollapsed ? "py-2 px-1 space-y-1" : "p-1.5 space-y-0.5"}`}>
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    title={isCollapsed ? item.name : ""}
                    className={`group flex items-center transition-all duration-150 ${
                      isCollapsed 
                        ? "justify-center h-8 w-8 mx-auto rounded-md" 
                        : "text-[12px] font-medium gap-2 px-2 py-1 rounded-md w-full"
                    } ${isActive
                        ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-bold shadow-xs"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
                      }`}
                  >
                    <div className={`transition-colors duration-150 flex items-center justify-center ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`}>
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <span className="text-nowrap flex items-center gap-1.5">
                        {item.name}
                        {item.badge && (
                          <span className="px-1.5 py-0.2 text-[8px] font-semibold rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white uppercase">
                            {item.badge}
                          </span>
                        )}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Settings with Submenu */}
            <li>
              <button
                onClick={() => {
                  if (isCollapsed) {
                    setIsCollapsed(false);
                  }
                  setSettingsExpanded(!settingsExpanded);
                }}
                title={isCollapsed ? "Settings" : ""}
                className={`group flex items-center transition-all duration-150 ${
                  isCollapsed 
                    ? "justify-center h-8 w-8 mx-auto rounded-md" 
                    : "justify-between text-[12px] font-medium gap-2 px-2 py-1 rounded-md w-full"
                } ${settingsItems.some(item => location.pathname === item.path)
                    ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-bold shadow-xs"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`transition-colors duration-150 flex items-center justify-center ${settingsItems.some(item => location.pathname === item.path) ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`}>
                    <SettingsIcon fontSize="small" />
                  </div>
                  {!isCollapsed && <span className="text-nowrap">Settings</span>}
                </div>
                {!isCollapsed && (
                  <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {settingsExpanded ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
                  </div>
                )}
              </button>

              {/* Submenu Items */}
              {settingsExpanded && !isCollapsed && (
                <ul className="ml-2.5 mt-0.5 pl-2 border-l border-gray-200 dark:border-gray-800 space-y-0.5">
                  {settingsItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={index}>
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileOpen(false)}
                          className={`group flex items-center text-[11px] font-medium gap-1.5 px-2 py-0.5 rounded-md transition-all duration-150 ${isActive
                              ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-bold shadow-xs"
                              : "text-gray-500 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                          <div className={`transition-colors duration-150 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`}>
                            {item.icon}
                          </div>
                          <span className="text-nowrap flex items-center gap-1.5">
                            {item.name}
                            {item.badge && (
                              <span className="px-1.5 py-0.2 text-[8px] font-semibold rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white uppercase">
                                {item.badge}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          </ul>
        </div>
        {/* Logout button */}
        <div className={`border-t border-slate-300 dark:border-gray-800 w-full flex justify-center ${isCollapsed ? "py-1.5" : "p-1.5"}`}>
          <button
            onClick={handleLogout}
            className={`group flex items-center justify-center transition-all duration-150 ${
              isCollapsed 
                ? "h-8 w-8 rounded-md" 
                : "gap-2 w-full px-2 py-1 text-[12px] font-medium rounded-md"
            } text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400`}
            title={isCollapsed ? "Logout" : ""}
          >
            <div className="text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              <LogoutIcon fontSize="small" />
            </div>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
