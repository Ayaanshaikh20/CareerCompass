import { Grid2, Box, Avatar, Tooltip, Typography, IconButton } from "../shared/Imports";
import { EditIcon, EmailIcon, PhoneIcon, LocationOnIcon } from "../shared/Icons";

const Profile = () => {
  const { first_name, location, phone_number, email } = JSON.parse(localStorage.getItem("user"));

  return (
    <section className='h-full p-6 pt-16 bg-background' >
      <Box p={4} maxWidth={1000}>
        <Grid2 container spacing={4}>
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
                <EmailIcon sx={{ mr: 1 }} />
                <Typography>{email}</Typography>
              </Box>
              <Box display='flex' alignItems='center' mb={1.5}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography>{phone_number}</Typography>
              </Box>
              <Box display='flex' alignItems='center'>
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography>{location}</Typography>
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </section>
  );
};

export default Profile;
