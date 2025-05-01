import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import { styled, useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import MuiDrawer from '@mui/material/Drawer';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const DashboardDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  border: 'none',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

const Sidebar = () => {
  const [isOpenDashboardSidebar, setIsOpenDashboardSidebar] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const toggleDashboardSidebar = () =>
    setIsOpenDashboardSidebar(!isOpenDashboardSidebar);

  const logoutAdmin = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  ];

  return (
    <main className='w-full flex flex-col'>
      {/* Drawer */}
      <div className=' w-full flex'>
        {['/dashboard'].includes(pathname) && (
          <div className='row-start-2 col-start-1 z-40'>
            <DashboardDrawer
              variant='permanent'
              title='Cupid Admin'
              className='border-none'
              open={isOpenDashboardSidebar}
              sx={{
                border: 'none',
                boxShadow: 'none',
                margin: 0,
              }}
            >
              <DrawerHeader>
                <IconButton
                  onClick={() => {
                    toggleDashboardSidebar();
                  }}
                >
                  {isOpenDashboardSidebar ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <List>
                {menuItems.map((item) => (
                  <ListItem
                    key={item.text}
                    title={item.text}
                    disablePadding
                    sx={{ display: 'block' }}
                  >
                    {item.text === 'Logout' ? (
                      <ListItemButton
                        sx={[
                          {
                            minHeight: 38,
                            px: 2.5,
                            '&:hover': {
                              backgroundColor: 'rgba(156, 163, 175, 0.3)',
                            },
                          },
                          pathname === item.path
                            ? { backgroundColor: 'rgba(156, 163, 175, 0.5)' }
                            : {},
                          isOpenDashboardSidebar
                            ? { justifyContent: 'initial' }
                            : { justifyContent: 'center' },
                        ]}
                        onClick={logoutAdmin} // Call logout function
                      >
                        <ListItemIcon
                          sx={[
                            { minWidth: 0, justifyContent: 'center' },
                            isOpenDashboardSidebar ? { mr: 3 } : { mr: 'auto' },
                          ]}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={[
                            isOpenDashboardSidebar
                              ? { opacity: 1 }
                              : { opacity: 0 },
                          ]}
                        />
                      </ListItemButton>
                    ) : (
                      <Link to={item.path}>
                        <ListItemButton
                          sx={[
                            {
                              minHeight: 38,
                              px: 2.5,
                              '&:hover': {
                                backgroundColor: 'rgba(156, 163, 175, 0.3)',
                              },
                            },
                            pathname === item.path
                              ? { backgroundColor: 'rgba(156, 163, 175, 0.5)' }
                              : {},
                            isOpenDashboardSidebar
                              ? { justifyContent: 'initial' }
                              : { justifyContent: 'center' },
                          ]}
                        >
                          <ListItemIcon
                            sx={[
                              { minWidth: 0, justifyContent: 'center' },
                              isOpenDashboardSidebar
                                ? { mr: 3 }
                                : { mr: 'auto' },
                            ]}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.text}
                            sx={[
                              isOpenDashboardSidebar
                                ? { opacity: 1 }
                                : { opacity: 0 },
                            ]}
                          />
                        </ListItemButton>
                      </Link>
                    )}
                  </ListItem>
                ))}
              </List>
              <Divider />
            </DashboardDrawer>
          </div>
        )}
      </div>
    </main>
  );
};

export default Sidebar;
