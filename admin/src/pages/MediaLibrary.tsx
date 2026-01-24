import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { Media } from '../types';

export default function MediaLibrary() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await axios.get('/media');
      setMedia(response.data);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchMedia();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await axios.delete(`/media/${id}`);
      fetchMedia();
    } catch (error) {
      console.error('Failed to delete file:', error);
      alert('Failed to delete file');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Media Library</Typography>
        <Box>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: 'none' }}
            id="upload-input"
          />
          <label htmlFor="upload-input">
            <Button
              variant="contained"
              component="span"
              startIcon={<UploadIcon />}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </label>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {media.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card>
              {item.mimeType.startsWith('image/') ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.url}
                  alt={item.originalName}
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.200',
                  }}
                >
                  <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                </Box>
              )}
              <CardContent>
                <Typography variant="body2" noWrap>
                  {item.originalName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(item.size / 1024).toFixed(2)} KB
                </Typography>
                <Box mt={1}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {media.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography color="text.secondary">
            No media files yet. Upload your first file to get started.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
