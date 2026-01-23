import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { Menu } from '../types';

export default function Menus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuLocation, setNewMenuLocation] = useState('');

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get('/menus');
      setMenus(response.data);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    }
  };

  const handleCreateMenu = async () => {
    try {
      await axios.post('/menus', {
        name: newMenuName,
        location: newMenuLocation,
      });
      fetchMenus();
      setOpenDialog(false);
      setNewMenuName('');
      setNewMenuLocation('');
    } catch (error: any) {
      console.error('Failed to create menu:', error);
      alert(error.response?.data?.message || 'Failed to create menu');
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this menu?')) return;

    try {
      await axios.delete(`/menus/${id}`);
      fetchMenus();
    } catch (error) {
      console.error('Failed to delete menu:', error);
      alert('Failed to delete menu');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Menus</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          New Menu
        </Button>
      </Box>

      <Grid container spacing={3}>
        {menus.map((menu) => (
          <Grid item xs={12} md={6} key={menu.id}>
            <Paper sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="h6">{menu.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Location: {menu.location}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteMenu(menu.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <List>
                {menu.items?.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={item.label}
                      secondary={item.url}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Menu</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Menu Name"
            value={newMenuName}
            onChange={(e) => setNewMenuName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            value={newMenuLocation}
            onChange={(e) => setNewMenuLocation(e.target.value)}
            margin="normal"
            helperText="e.g., 'header', 'footer'"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateMenu}
            variant="contained"
            disabled={!newMenuName || !newMenuLocation}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
