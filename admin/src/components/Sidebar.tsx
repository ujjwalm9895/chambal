import {
  Box,
  Drawer,
  List,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Pages as PagesIcon,
  Image as ImageIcon,
  MenuBook as MenuBookIcon,
  Article as ArticleIcon,
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  FileUpload as FileUploadIcon,
  List as ListIcon,
  Star as StarIcon,
  ViewCarousel as ViewCarouselIcon,
  Announcement as AnnouncementIcon,
  Recommend as RecommendIcon,
  PendingActions as PendingIcon,
  Schedule as ScheduleIcon,
  Drafts as DraftsIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const drawerWidth = 250;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: 'permanent' | 'persistent' | 'temporary';
}

export default function Sidebar({ open, onClose, variant }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [postsOpen, setPostsOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path || location.search.includes(path.split('?')[1] || '');

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Media',
      icon: <ImageIcon />,
      path: '/media',
    },
    {
      text: 'Menus',
      icon: <MenuBookIcon />,
      path: '/menus',
    },
    {
      text: 'Categories',
      icon: <ListIcon />,
      path: '/categories',
    },
    {
      text: 'Pages',
      icon: <PagesIcon />,
      path: '/pages',
    },
  ];

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#222d32',
          color: '#b8c7ce',
          borderRight: 'none',
        },
      }}
    >
      {/* Brand Logo */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#367fa9',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.2rem',
        }}
      >
        Chambal Sandesh
      </Box>

      {/* User Panel */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid #1a2226',
        }}
      >
        <Avatar
          src="/user-avatar.png" // Placeholder
          alt={user?.email}
          sx={{ width: 45, height: 45 }}
        >
          {user?.email?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" color="#fff" fontWeight="bold">
            {user?.email?.split('@')[0]}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#3c763d',
              }}
            />
            <Typography variant="caption">online</Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ overflow: 'auto', mt: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: 'block',
            bgcolor: '#1a2226',
            color: '#4b646f',
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}
        >
          Main Navigation
        </Typography>

        <List component="nav" sx={{ p: 0 }}>
          {/* Dashboard */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={isActive('/dashboard')}
              onClick={() => navigate('/dashboard')}
              sx={{
                minHeight: 48,
                '&.Mui-selected': {
                  bgcolor: '#1e282c',
                  borderLeft: '3px solid #3c8dbc',
                  color: '#fff',
                  '&:hover': { bgcolor: '#1e282c' },
                },
                '&:hover': {
                  bgcolor: '#1e282c',
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          {/* Add Post */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => navigate('/posts/new')}
              sx={{
                '&:hover': { bgcolor: '#1e282c', color: '#fff' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Post" />
            </ListItemButton>
          </ListItem>

          {/* Bulk Upload */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                '&:hover': { bgcolor: '#1e282c', color: '#fff' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <FileUploadIcon />
              </ListItemIcon>
              <ListItemText primary="Bulk Post Upload" />
            </ListItemButton>
          </ListItem>

          {/* Posts Dropdown */}
          <ListItemButton
            onClick={() => setPostsOpen(!postsOpen)}
            sx={{
              '&:hover': { bgcolor: '#1e282c', color: '#fff' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="Posts" />
            {postsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={postsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ bgcolor: '#2c3b41' }}>
              <ListItemButton
                sx={{ pl: 4, '&:hover': { color: '#fff' } }}
                onClick={() => navigate('/posts')}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <ListIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Posts" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4, '&:hover': { color: '#fff' } }}
                onClick={() => navigate('/posts?isSlider=true')}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <ViewCarouselIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Slider Posts" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4, '&:hover': { color: '#fff' } }}
                onClick={() => navigate('/posts?isFeatured=true')}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <StarIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Featured Posts" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4, '&:hover': { color: '#fff' } }}
                onClick={() => navigate('/posts?isBreaking=true')}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <AnnouncementIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Breaking News" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4, '&:hover': { color: '#fff' } }}
                onClick={() => navigate('/posts?isRecommended=true')}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <RecommendIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Recommended Posts" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4, '&:hover': { color: '#fff' } }}
                onClick={() => navigate('/posts?status=PENDING')}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <PendingIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Pending Posts" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4, '&:hover': { color: '#fff' } }}
                onClick={() => navigate('/posts?status=SCHEDULED')}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <ScheduleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Scheduled Posts" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4, '&:hover': { color: '#fff' } }}
                onClick={() => navigate('/posts?status=DRAFT')}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <DraftsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Other Items */}
          {menuItems.slice(1).map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 48,
                  '&.Mui-selected': {
                    bgcolor: '#1e282c',
                    borderLeft: '3px solid #3c8dbc',
                    color: '#fff',
                    '&:hover': { bgcolor: '#1e282c' },
                  },
                  '&:hover': {
                    bgcolor: '#1e282c',
                    color: '#fff',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
