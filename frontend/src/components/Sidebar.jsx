import { CustomButton, Link, useLocation, useNavigate, useQueryClient, useState } from "../shared/Imports";
import { AccountCircleIcon, compass, DashboardIcon, FaChevronLeft, FaChevronRight, LogoutIcon, WorkIcon } from "../shared/Icons"

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon fontSize="small" /> },
    { name: "Applied Jobs", path: "/applied-jobs", icon: <WorkIcon fontSize="small" /> },
    { name: "Profile", path: "/profile", icon: <AccountCircleIcon fontSize="small" /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    queryClient.getQueryData(["user"]);
    queryClient.setQueryData(["user"], null);
    navigate("/");
  };

  return (
    <aside
      className={`bg-border
        h-screen transition-all duration-500 ${isCollapsed ? "w-20" : "w-72"
        } flex flex-col justify-between`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* Top Section */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-darkBackground">
          <div className="flex items-center gap-3">
            <div className="bg-background rounded-full w-9 h-9 flex items-center justify-center font-bold">
              {user?.first_name ? user.first_name.charAt(0).toUpperCase() : "U"}
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-semibold text-sm flex items-center gap-1"><img src={compass} alt='compass_logo' className='h-4 w-4' />CareerCompass</h1>
                <p className="text-xs text-textSecondary text-nowrap">Welcome, {user?.first_name}</p>
              </div>
            )}
          </div>
          <button className="text-textPrimary hover:text-primaryHover transition">
            {isCollapsed ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
          </button>
        </div>

        {/* Menu */}
        <ul className="p-4 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  title={isCollapsed ? item.name : ""}
                  className={`flex items-center text-sm gap-3 px-3 py-2 rounded-sm transition-all duration-400 ${isActive
                    ? "bg-background text-textPrimary font-medium"
                    : "hover:bg-secondaryHover text-textPrimary"
                    }`}
                >
                  {item.icon}
                  {!isCollapsed && <span className=" text-nowrap">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout button */}
      <div className="flex w-full justify-center mb-6 p-4">
        <CustomButton
          handleClick={handleLogout}
          type="submit"
          key={"logout"}
          variant={"primary"}
        >
          <LogoutIcon fontSize="small" />
          {!isCollapsed && <span>Logout</span>}
        </CustomButton>
      </div>

    </aside>
  );
};

export default Sidebar;
