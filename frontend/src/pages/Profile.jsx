import { Grid2, Box, Avatar, Tooltip, Typography, IconButton } from "../shared/imports";
import { EditIcon, EmailIcon, PhoneIcon, LocationOnIcon } from "../shared/icons";

const Profile = () => {
  const { first_name, location, phone_number, email } = JSON.parse(localStorage.getItem("user"));

  return (
    <section className='h-full p-6 pt-16 bg-zinc-900' >
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
                <Typography variant='h4' color="white" fontWeight={600}>
                  {first_name}
                </Typography>
              </Box>
              <Tooltip title='Edit Profile'>
                <IconButton>
                  <EditIcon className=" text-yellow-500" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box mt={3}>
              <Box display='flex' alignItems='center' mb={1.5}>
                <EmailIcon color='primary' sx={{ mr: 1 }} />
                <Typography color="white">{email}</Typography>
              </Box>
              <Box display='flex' alignItems='center' mb={1.5}>
                <PhoneIcon color='primary' sx={{ mr: 1 }} />
                <Typography color="white">{phone_number}</Typography>
              </Box>
              <Box display='flex' alignItems='center'>
                <LocationOnIcon color='primary' sx={{ mr: 1 }} />
                <Typography color="white">{location}</Typography>
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </section>
  );
};

export default Profile;
