import { Link, useLocation } from "../shared/imports";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Applied jobs", path: "/applied-jobs" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className='relative hidden md:block h-[calc(100vh-65px)]'>
      <div className='h-full w-56 bg-white shadow-md border-r transition-all duration-300'>
        <div className='p-2 text-lg font-semibold border-b text-blue-700'>Menu</div>
        <ul className='p-2 space-y-1'>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`block px-4 py-1 rounded-md transition-colors duration-200 ${
                    isActive ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
