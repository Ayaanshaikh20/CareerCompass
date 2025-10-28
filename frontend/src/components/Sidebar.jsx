import { Link, useLocation } from "../shared/imports";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Applied jobs", path: "/applied-jobs" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <div className=' min-h-screen'>
      <div className='h-full w-56 pt-14 bg-[#171717] shadow-md transition-all duration-300'>
        <div className='p-2 text-lg font-semibold border-b text-white'>Menu</div>
        <ul className='p-5 space-y-3'>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`block px-4 py-1 rounded-md transition-colors duration-200 ${
                    isActive ? "bg-black text-white font-medium" : "text-white hover:bg-black"
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
