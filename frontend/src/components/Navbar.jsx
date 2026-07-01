import { useNavigate, useLocation } from "../shared/Imports";
import { compass } from "../shared/Icons";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo and Title */}
        <div 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="p-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 rounded-lg border border-blue-100 dark:border-indigo-900/50 shadow-sm group-hover:shadow transition-all duration-300">
            <img src={compass} className="h-5 w-5 group-hover:rotate-[15deg] transition-transform duration-300 ease-out" alt="CareerCompassLogo" />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            CareerCompass
          </span>
        </div>

        {/* Dynamic Context Button */}
        <nav className="flex items-center gap-3">
          {pathname === "/login" && (
            <button 
              onClick={() => navigate("/register")}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow hover:shadow-md transition-all duration-200"
            >
              Register
            </button>
          )}
          {pathname === "/register" && (
            <button 
              onClick={() => navigate("/login")}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 border border-gray-200 dark:border-gray-700 transition-all duration-200"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
