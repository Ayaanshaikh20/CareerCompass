import { AppBar, useQueryClient, useQuery, useNavigate, Toolbar, Typography, useLocation, CustomButton } from "../shared/Imports";
import { compass } from "../shared/Icons";

const Navbar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => JSON.parse(localStorage.getItem("user")),
  });

  const handleClickOpen = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.clear();
    queryClient.getQueryData(["user"]);
    queryClient.setQueryData(["user"], null);
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      elevation={pathname !== "/login" && pathname !== "/register" ? 3 : 0}
      sx={{
        backgroundColor: "var(--background-color)",
      }}
    >
      <Toolbar className='w-full flex justify-between items-center px-2 !min-h-0 py-2'>
        {/* Brand Logo and Title */}
        <div className='flex items-center cursor-pointer space-x-1' onClick={() => navigate("/")}>
          <Typography
            variant="h6"
            className=" text-textPrimary"
          >
            Career
          </Typography>
          <img src={compass} alt='compass_logo' className='h-5 w-5' />
          <Typography
            variant="h6"
            className=" text-textPrimary"
          >
            Compass
          </Typography>
        </div>

        {/* Right Side Controls */}
        <div className='flex items-center gap-2'>
          {!user ? (
            <>
              {
                (pathname == "/login" || pathname == "/register") ? (
                  <></>
                ) : (
                  <>
                    <CustomButton variant={"primary"} handleClick={handleClickOpen}>
                      Login
                    </CustomButton>
                    <CustomButton variant={"secondary"} handleClick={() => navigate("/register")}>
                      Register
                    </CustomButton>
                  </>)
              }
            </>
          ) : (
            <div className=" flex gap-x-5">
              <CustomButton variant={"secondary"} handleClick={handleLogout}>
                Logout
              </CustomButton>
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
