import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#ecf0f5' }}>
      <Topbar onSidebarToggle={handleSidebarToggle} sidebarOpen={isDesktop ? sidebarOpen : false} />
      
      <Sidebar
        open={isDesktop ? sidebarOpen : !sidebarOpen} // Logic: On desktop, toggle hides/shows. On mobile, toggle shows/hides.
        variant={isDesktop ? 'persistent' : 'temporary'}
        onClose={() => setSidebarOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(isDesktop && sidebarOpen && {
            width: `calc(100% - 250px)`,
            ml: 0,
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar /> {/* Spacer for Topbar */}
        <Outlet />
      </Box>
    </Box>
  );
}
