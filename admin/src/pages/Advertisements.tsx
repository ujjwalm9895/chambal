import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

interface Advertisement {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: 'HEADER' | 'SIDEBAR' | 'FOOTER' | 'IN_CONTENT' | 'BOTTOM_BANNER';
  status: 'ACTIVE' | 'INACTIVE';
  order: number;
  startDate?: string;
  endDate?: string;
}

export default function Advertisements() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Partial<Advertisement>>({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    position: 'BOTTOM_BANNER',
    status: 'ACTIVE',
    order: 0,
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await axios.get('/advertisements');
      setAds(response.data);
    } catch (error) {
      console.error('Failed to fetch advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingAd.title || !editingAd.imageUrl) {
      alert('Title and Image URL are required');
      return;
    }

    try {
      if (editingAd.id) {
        await axios.patch(`/advertisements/${editingAd.id}`, editingAd);
      } else {
        await axios.post('/advertisements', editingAd);
      }
      setOpen(false);
      fetchAds();
      setEditingAd({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        position: 'BOTTOM_BANNER',
        status: 'ACTIVE',
        order: 0,
      });
    } catch (error: any) {
      console.error('Failed to save advertisement:', error);
      alert(error.response?.data?.message || 'Failed to save advertisement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) return;
    try {
      await axios.delete(`/advertisements/${id}`);
      fetchAds();
    } catch (error) {
      console.error('Failed to delete advertisement:', error);
      alert('Failed to delete advertisement');
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setOpen(true);
  };

  const handleAddNew = () => {
    setEditingAd({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 'BOTTOM_BANNER',
      status: 'ACTIVE',
      order: 0,
    });
    setOpen(true);
  };

  const getPositionColor = (position: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      HEADER: 'primary',
      SIDEBAR: 'info',
      FOOTER: 'secondary',
      IN_CONTENT: 'warning',
      BOTTOM_BANNER: 'error',
    };
    return colors[position] || 'default';
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Advertisements</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew}>
          Add Advertisement
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Image Preview</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>{ad.title}</TableCell>
                <TableCell>
                  <Chip
                    label={ad.position.replace('_', ' ')}
                    color={getPositionColor(ad.position)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ad.status}
                    color={ad.status === 'ACTIVE' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{ad.order}</TableCell>
                <TableCell>
                  {ad.imageUrl && (
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      style={{ width: 100, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEdit(ad)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(ad.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingAd.id ? 'Edit Advertisement' : 'New Advertisement'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editingAd.title}
            onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={editingAd.description || ''}
            onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={editingAd.imageUrl}
            onChange={(e) => setEditingAd({ ...editingAd, imageUrl: e.target.value })}
            required
            helperText="URL of the advertisement image"
          />
          <TextField
            margin="dense"
            label="Link URL"
            fullWidth
            value={editingAd.linkUrl || ''}
            onChange={(e) => setEditingAd({ ...editingAd, linkUrl: e.target.value })}
            helperText="URL to redirect when ad is clicked (optional)"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Position</InputLabel>
            <Select
              value={editingAd.position}
              onChange={(e) => setEditingAd({ ...editingAd, position: e.target.value as any })}
              label="Position"
            >
              <MenuItem value="HEADER">Header</MenuItem>
              <MenuItem value="SIDEBAR">Sidebar</MenuItem>
              <MenuItem value="FOOTER">Footer</MenuItem>
              <MenuItem value="IN_CONTENT">In Content</MenuItem>
              <MenuItem value="BOTTOM_BANNER">Bottom Banner</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={editingAd.status}
              onChange={(e) => setEditingAd({ ...editingAd, status: e.target.value as any })}
              label="Status"
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Order"
            type="number"
            fullWidth
            value={editingAd.order}
            onChange={(e) => setEditingAd({ ...editingAd, order: parseInt(e.target.value) || 0 })}
            helperText="Lower numbers appear first"
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={editingAd.startDate ? new Date(editingAd.startDate).toISOString().slice(0, 16) : ''}
            onChange={(e) => setEditingAd({ ...editingAd, startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="datetime-local"
            fullWidth
            value={editingAd.endDate ? new Date(editingAd.endDate).toISOString().slice(0, 16) : ''}
            onChange={(e) => setEditingAd({ ...editingAd, endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
