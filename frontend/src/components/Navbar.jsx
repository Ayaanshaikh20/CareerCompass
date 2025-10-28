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
    <AppBar
      position='fixed'
      elevation={1}
      sx={{
        backgroundColor: "#171717",
        borderBottom: "1px solid #434345",
      }}
    >
      <Toolbar className='w-full flex justify-between items-center px-2 !min-h-0 py-2'>

        {/* Brand Logo and Title */}
        <div className='flex items-center cursor-pointer space-x-1' onClick={() => navigate("/")}>
          <Typography
            variant='h6'
            component='div'
            sx={{
              fontSize: "1.1rem",
              color: "#ffffff", // Tailwind blue-500
              fontWeight: 500,
              letterSpacing: "0.5px",
            }}
          >
            Career
          </Typography>
          <img src={compass} alt='compass_logo' className='h-5 w-5' />
          <Typography
            variant='h6'
            component='div'
            sx={{
              fontSize: "1.1rem",
              color: "#ffffff",
              fontWeight: 500,
              letterSpacing: "0.5px",
            }}
          >
            Compass
          </Typography>
        </div>

        {/* Right Side Controls */}
        <div className='flex items-center gap-2'>
          {!user ? (
            <>
              <Button
                onClick={handleClickOpen}
                variant="solid"
                size="2"
                style={{
                  backgroundColor: "black",
                  border: "1px solid #434345"
                }}
                className=" tracking-wide"
                radius="large"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/register")}
                size="2"
                variant="solid"
                style={{
                  backgroundColor: "white",
                  color: 'black',
                  border: "1px solid #434345"
                }}
              >
                Register
              </Button>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              size="2"
              variant="solid"
              style={{
                backgroundColor: "white",
                color: 'black',
                border: "1px solid #434345"
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
