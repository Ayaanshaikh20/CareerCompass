import { Grid2, Box, Avatar, Tooltip, Typography, IconButton } from "../shared/imports";
import { EditIcon, EmailIcon, PhoneIcon, LocationOnIcon } from "../shared/icons";

const Profile = () => {
  const user = {
    name: "John Doe",
    role: "Software Engineer",
    email: "johndoe@example.com",
    phone: "+91 9876543210",
    location: "Bangalore, India",
    avatar: "https://i.pravatar.cc/300?img=3",
  };

  return (
    <Box p={4} maxWidth={1000} mx='auto'>
      <Grid2 container spacing={4} alignItems='center'>
        {/* Left: Large Avatar */}
        <Grid2 xs={12} md={4}>
          <Avatar
            // src={user.avatar}
            // alt={user.name}
            sx={{
              width: "100%",
              height: "auto",
              maxWidth: 300,
              boxShadow: 3,
            }}
            variant='rounded'
          />
        </Grid2>

        {/* Right: Details */}
        <Grid2 xs={12} md={8}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Box>
              <Typography variant='h4' fontWeight={600}>
                {user.name}
              </Typography>
              <Typography variant='subtitle1' color='text.secondary' mt={0.5}>
                {user.role}
              </Typography>
            </Box>
            <Tooltip title='Edit Profile'>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box mt={3}>
            <Box display='flex' alignItems='center' mb={1.5}>
              <EmailIcon color='primary' sx={{ mr: 1 }} />
              <Typography>{user.email}</Typography>
            </Box>
            <Box display='flex' alignItems='center' mb={1.5}>
              <PhoneIcon color='primary' sx={{ mr: 1 }} />
              <Typography>{user.phone}</Typography>
            </Box>
            <Box display='flex' alignItems='center'>
              <LocationOnIcon color='primary' sx={{ mr: 1 }} />
              <Typography>{user.location}</Typography>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Profile;
