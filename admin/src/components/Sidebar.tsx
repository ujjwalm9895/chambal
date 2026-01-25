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
  IconButton,
  Tooltip,
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
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const drawerWidth = 250;
const collapsedWidth = 64;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: 'permanent' | 'persistent' | 'temporary';
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ open, onClose, variant, collapsed = false, onToggleCollapse }: SidebarProps) {
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
    {
      text: 'Site Settings',
      icon: <SettingsIcon />,
      path: '/site-settings',
    },
    {
      text: 'Advertisements',
      icon: <ImageIcon />,
      path: '/advertisements',
    },
  ];

  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: currentWidth,
        flexShrink: 0,
        transition: (theme) => theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: currentWidth,
          boxSizing: 'border-box',
          bgcolor: '#2c3b41',
          color: '#b8c7ce',
          borderRight: 'none',
          overflowX: 'hidden',
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {/* Collapse Toggle Button */}
      {onToggleCollapse && (
        <Box
          sx={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-end',
            pr: collapsed ? 0 : 2,
            borderBottom: '1px solid #1a2226',
          }}
        >
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
            <IconButton
              onClick={onToggleCollapse}
              sx={{
                color: '#b8c7ce',
                '&:hover': {
                  bgcolor: '#1e282c',
                  color: '#fff',
                },
              }}
            >
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* User Panel - Only show when expanded */}
      {!collapsed && (
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
            src="/user-avatar.png"
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
      )}

      {/* Avatar only when collapsed */}
      {collapsed && (
        <Box
          sx={{
            p: 1,
            display: 'flex',
            justifyContent: 'center',
            borderBottom: '1px solid #1a2226',
          }}
        >
          <Tooltip title={user?.email || 'User'} placement="right">
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#367fa9',
                cursor: 'pointer',
              }}
            >
              {user?.email?.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        </Box>
      )}

      {/* Navigation */}
      <Box sx={{ overflow: 'auto', mt: 1 }}>
        {!collapsed && (
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
        )}

        <List component="nav" sx={{ p: 0 }}>
          {/* Dashboard */}
          <Tooltip title={collapsed ? 'Home' : ''} placement="right">
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={isActive('/dashboard')}
                onClick={() => navigate('/dashboard')}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1 : 2,
                  '&.Mui-selected': {
                    bgcolor: '#1e282c',
                    borderLeft: collapsed ? 'none' : '3px solid #3c8dbc',
                    color: '#fff',
                    '&:hover': { bgcolor: '#1e282c' },
                  },
                  '&:hover': {
                    bgcolor: '#1e282c',
                    color: '#fff',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center', color: 'inherit' }}>
                  <DashboardIcon />
                </ListItemIcon>
                {!collapsed && <ListItemText primary="Home" />}
              </ListItemButton>
            </ListItem>
          </Tooltip>

          {/* Add Post */}
          <Tooltip title={collapsed ? 'Add Post' : ''} placement="right">
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate('/posts/new')}
                sx={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1 : 2,
                  '&:hover': { bgcolor: '#1e282c', color: '#fff' },
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center', color: 'inherit' }}>
                  <AddIcon />
                </ListItemIcon>
                {!collapsed && <ListItemText primary="Add Post" />}
              </ListItemButton>
            </ListItem>
          </Tooltip>

          {/* Bulk Upload */}
          <Tooltip title={collapsed ? 'Bulk Upload' : ''} placement="right">
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => navigate('/posts/bulk-upload')}
                sx={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1 : 2,
                  '&:hover': { bgcolor: '#1e282c', color: '#fff' },
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center', color: 'inherit' }}>
                  <FileUploadIcon />
                </ListItemIcon>
                {!collapsed && <ListItemText primary="Bulk Post Upload" />}
              </ListItemButton>
            </ListItem>
          </Tooltip>

          {/* Posts Dropdown */}
          <Tooltip title={collapsed ? 'Posts' : ''} placement="right">
            <ListItemButton
              onClick={() => {
                if (collapsed) {
                  navigate('/posts');
                } else {
                  setPostsOpen(!postsOpen);
                }
              }}
              sx={{
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 2,
                '&:hover': { bgcolor: '#1e282c', color: '#fff' },
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center', color: 'inherit' }}>
                <ArticleIcon />
              </ListItemIcon>
              {!collapsed && (
                <>
                  <ListItemText primary="Posts" />
                  {postsOpen ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>
          </Tooltip>
          {!collapsed && (
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
          )}

          {/* Other Items */}
          {menuItems.slice(1).map((item) => (
            <Tooltip key={item.text} title={collapsed ? item.text : ''} placement="right">
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  selected={isActive(item.path)}
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 2,
                    '&.Mui-selected': {
                      bgcolor: '#1e282c',
                      borderLeft: collapsed ? 'none' : '3px solid #3c8dbc',
                      color: '#fff',
                      '&:hover': { bgcolor: '#1e282c' },
                    },
                    '&:hover': {
                      bgcolor: '#1e282c',
                      color: '#fff',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center', color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={item.text} />}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
