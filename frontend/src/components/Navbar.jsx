import { AppBar, useQueryClient, useQuery, useNavigate, Toolbar, Typography, useLocation, CustomButton } from "../shared/Imports";
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
        backgroundColor: "var(--background-color)",
        borderBottom: "1px solid var(--dark-background-color)",
      }}
    >
      <Toolbar className="w-full flex justify-between items-center px-2 !min-h-0 py-1">
        {/* Brand Logo and Title */}
        <div className="flex items-center cursor-pointer space-x-1" onClick={() => navigate("/")}>
          <Typography variant="h6" className=" text-textPrimary">
            Career
          </Typography>
          <img src={compass} alt="compass_logo" className="h-5 w-5" />
          <Typography variant="h6" className=" text-textPrimary">
            Compass
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
