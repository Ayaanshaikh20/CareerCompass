import { Grid2, Box, Avatar, Tooltip, Typography, IconButton } from "../shared/imports";
import { EditIcon, EmailIcon, PhoneIcon, LocationOnIcon } from "../shared/icons";

const Profile = () => {
  const { first_name, location, phone_number, email } = JSON.parse(localStorage.getItem("user"));

  return (
    <Box p={4} maxWidth={1000} mx='auto'>
      <Grid2 container spacing={4} alignItems='center'>
        <Grid2 xs={12} md={4}>
          <Avatar
            sx={{
              width: "100%",
              height: "auto",
              maxWidth: 300,
              boxShadow: 3,
            }}
            variant='rounded'
          />
        </Grid2>

        <Grid2 xs={12} md={8}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Box>
              <Typography variant='h4' fontWeight={600}>
                {first_name}
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
              <Typography>{email}</Typography>
            </Box>
            <Box display='flex' alignItems='center' mb={1.5}>
              <PhoneIcon color='primary' sx={{ mr: 1 }} />
              <Typography>{phone_number}</Typography>
            </Box>
            <Box display='flex' alignItems='center'>
              <LocationOnIcon color='primary' sx={{ mr: 1 }} />
              <Typography>{location}</Typography>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Profile;
