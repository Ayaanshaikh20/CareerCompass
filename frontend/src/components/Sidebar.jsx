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
        className={`bg-white dark:bg-gray-900 flex flex-col justify-between font-sans border-r border-gray-300 dark:border-gray-700
    h-full transition-all duration-300 ease-in-out
    fixed md:static z-50 md:z-auto
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    ${isCollapsed ? "w-14" : "w-60"}`}
      >
        {/* Top Section */}
        <div className="">
          {/* Logo */}
          <div
            className={`flex ${!isCollapsed ? "justify-end" : "justify-center"} border-b items-center px-3 py-1 border-gray-300 dark:border-gray-700`}
          >
            {!isCollapsed ? (
              <div className="flex items-center">
                <button
                  className="px-1 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 rounded transition-colors hidden md:block"
                  onClick={() => setIsCollapsed(true)}
                  title="Collapse sidebar"
                >
                  <MenuIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <button
                  className="px-1 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 rounded transition-colors hidden md:block"
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
                    onClick={() => setIsMobileOpen(false)}
                    title={isCollapsed ? item.name : ""}
                    className={`flex items-center text-xs gap-3 px-2 py-1 rounded-sm transition-all duration-400 ${isActive
                        ? "bg-slate-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 font-normal"
                        : "hover:bg-gray-300 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                  >
                    {item.icon}
                    {!isCollapsed && (
                      <span className="text-nowrap flex items-center gap-2">
                        {item.name}
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white uppercase">
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
                className={`flex items-center justify-between text-xs gap-3 px-2 py-1 rounded-sm transition-all duration-400 w-full ${settingsItems.some(item => location.pathname === item.path)
                    ? "bg-slate-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 font-normal"
                    : "hover:bg-gray-300 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <SettingsIcon fontSize="small" />
                  {!isCollapsed && <span className="text-nowrap">Settings</span>}
                </div>
                {!isCollapsed && (
                  settingsExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />
                )}
              </button>

              {/* Submenu Items */}
              {settingsExpanded && !isCollapsed && (
                <ul className="ml-6 mt-1 space-y-1">
                  {settingsItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={index}>
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center text-xs gap-3 px-2 py-1 rounded-sm transition-all duration-400 ${isActive
                              ? "bg-slate-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 font-normal"
                              : "hover:bg-gray-300 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                        >
                          {item.icon}
                          <span className="text-nowrap flex items-center gap-2">
                            {item.name}
                            {item.badge && (
                              <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white uppercase">
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
    </>
  );
};

export default Sidebar;
