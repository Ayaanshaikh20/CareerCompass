import { AppBar, Button, useQueryClient, useQuery, useNavigate, Toolbar, Typography } from "../shared/imports";
import { compass } from "../shared/icons";

const Navbar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      <AppBar
        position='static'
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Toolbar className='w-full flex justify-between items-center px-6 py-1'>
          {/* Brand Logo and Title */}
          <div className='flex items-center cursor-pointer' onClick={() => navigate("/")}>
            <Typography variant='h6' component='div' sx={{ color: "#1E3A8A", fontWeight: 600 }}>
              Career C
            </Typography>
            <img src={compass} alt='compass_logo' className='h-5 w-5' />
            <Typography variant='h6' component='div' sx={{ color: "#1E3A8A", fontWeight: 600 }}>
              mpass
            </Typography>
          </div>

          {/* Right Side Controls */}
          <div className='flex items-center gap-3'>
            {!user ? (
              <>
                <Button
                  onClick={handleClickOpen}
                  size='small'
                  sx={{
                    backgroundColor: "#2563EB",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 500,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "#1D4ED8",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => navigate("/register")}
                  sx={{
                    borderColor: "#2563EB",
                    color: "#2563EB",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#EFF6FF",
                      borderColor: "#1D4ED8",
                      color: "#1D4ED8",
                    },
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <Button
                size='small'
                onClick={handleLogout}
                sx={{
                  backgroundColor: "#2563EB",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 500,
                  px: 2,
                  "&:hover": {
                    backgroundColor: "#1D4ED8",
                  },
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
