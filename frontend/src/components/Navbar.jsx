import { AppBar, useQueryClient, useQuery, useNavigate, Toolbar, Typography, useLocation } from "../shared/Imports";
import { compass } from "../shared/Icons";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <AppBar
      position="sticky"
      className=" font-sans"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        borderBottom: "1px solid",
        borderColor: "rgb(209 213 219 / 1)",
      }}
    >
      <Toolbar className="w-full flex justify-between items-center px-2 !min-h-0 py-1 bg-gray-50 dark:bg-gray-900">
        {/* Brand Logo and Title */}
        <div className="flex items-center cursor-pointer space-x-1" onClick={() => navigate("/")}>
          <Typography variant="h6" className="text-gray-900 dark:text-gray-100">
            Career
          </Typography>
          <img src={compass} alt="compass_logo" className="h-5 w-5" />
          <Typography variant="h6" className="text-gray-900 dark:text-gray-100">
            Compass
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
