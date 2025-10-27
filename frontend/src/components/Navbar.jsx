import { Button, useQueryClient, useQuery, useNavigate, Toolbar, useState, Drawer, Box } from "../shared/imports";
import { compass, MenuIcon } from "../shared/icons";

const Navbar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);

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
    <>
      <nav className="sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <Toolbar className="w-full flex justify-between items-center">
            {/* Brand Logo and Title */}
            <div
              className="flex items-center cursor-pointer space-x-1"
              onClick={() => navigate("/")}
            >
              {/* Hamburger Button */}
              <button
                type="button"
                onClick={() => setOpenMenu(true)}
                className=" inline-flex lg:hidden items-center mr-3 justify-center rounded-md text-black"
              >
                <span className="sr-only">Open main menu</span>
                <MenuIcon />
              </button>
              <span className=" text-black text-xl font-semibold">
                Career
              </span>
              <img src={compass} alt="compass_logo" className="h-5 w-5" />
              <span className=" text-black text-xl font-semibold">
                Compass
              </span>
            </div>

            {/* Right Side Buttons */}
            <div className="hidden lg:flex items-center gap-2">
              {!user ? (
                <>
                  <Button
                    onClick={handleClickOpen}
                    size="small"
                    variant="contained"
                    className="primary-button"
                  >
                    Login
                  </Button>
                  <Button
                  className="secondary-button"
                    onClick={() => navigate("/register")}
                    size="small"
                    variant="outlined"
                  >
                    Register
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLogout}
                  size="small"
                  variant="contained"
                  className="primary-button"
                >
                  Logout
                </Button>
              )}
            </div>
          </Toolbar>
        </div>
      </nav>
      {/* Mobile Drawer Menu */}
      <Drawer
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        PaperProps={{
          sx: {
            color: 'white',
            width: 280,
            boxShadow: 'none',
            padding: "1rem 1rem",
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "10px"
          },
        }}
      >
        <Box role="presentation" onClick={() => setOpenMenu(false)}>
          <div className="flex flex-col font-sans">
            {/* Drawer Title */}
            <h2 className="text-xl font-semibold text-black mb-5">Menu</h2>
            {/* Buttons */}
            {!user ? (
              <ul className="space-y-2">
                <li>
                  <Button
                    onClick={() => {
                      setOpenMenu(false);
                      handleClickOpen();
                    }}
                    fullWidth
                    size="small"
                    variant="contained"
                    className="justify-start text-left bg-transparent hover:bg-white hover:text-black transition-all duration-200 rounded-md px-4 py-3"
                  >
                    Login
                  </Button>
                </li>
                <li>
                  <Button
                    onClick={() => {
                      setOpenMenu(false);
                      navigate("/register");
                    }}
                    fullWidth
                    size="small"
                    variant="outlined"
                    className="justify-start text-left bg-transparent hover:bg-white hover:text-black transition-all duration-200 rounded-md px-4 py-3"
                  >
                    Register
                  </Button>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2">
                <li>
                  <Button
                    onClick={() => {
                      setOpenMenu(false);
                      handleLogout();
                    }}
                    fullWidth
                    variant="contained"
                    className="justify-start text-left bg-transparent hover:bg-white hover:text-black transition-all duration-200 rounded-md px-4 py-3"
                  >
                    Logout
                  </Button>
                </li>
              </ul>
            )}
          </div>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
