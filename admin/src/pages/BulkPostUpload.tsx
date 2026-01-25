import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Menu as MenuIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import axios from 'axios';

export default function BulkPostUpload() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      handleFileUpload(file);
    } else {
      setUploadStatus({ type: 'error', message: 'Please upload a CSV file' });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      handleFileUpload(file);
    } else {
      setUploadStatus({ type: 'error', message: 'Please select a CSV file' });
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadStatus(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('/posts/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setUploadStatus({
        type: 'success',
        message: `Successfully uploaded ${response.data.created || 0} posts! ${response.data.errors || 0} errors.`,
      });
    } catch (error: any) {
      console.error('Failed to upload CSV:', error);
      setUploadStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to upload CSV file. Please check the format and try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (type: 'template' | 'example' | 'categories') => {
    try {
      let endpoint = '';
      let filename = '';
      
      switch (type) {
        case 'template':
          endpoint = '/posts/bulk-upload/template';
          filename = 'bulk-post-template.csv';
          break;
        case 'example':
          endpoint = '/posts/bulk-upload/example';
          filename = 'bulk-post-example.csv';
          break;
        case 'categories':
          endpoint = '/categories/export';
          filename = 'category-ids.csv';
          break;
      }
      
      const response = await axios.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Bulk Post Upload
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<MenuIcon />}
          onClick={() => navigate('/posts')}
          sx={{ bgcolor: '#00a65a', '&:hover': { bgcolor: '#008d4c' } }}
        >
          Posts
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Panel - Bulk Post Upload */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Bulk Post Upload
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              You can add your posts with a CSV file from this section
            </Typography>

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Upload CSV File
            </Typography>

            {uploadStatus && (
              <Alert severity={uploadStatus.type} sx={{ mb: 3 }}>
                {uploadStatus.message}
              </Alert>
            )}

            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                border: '2px dashed',
                borderColor: isDragging ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 6,
                textAlign: 'center',
                bgcolor: isDragging ? 'action.hover' : 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.3s',
                minHeight: 300,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              {uploading ? (
                <Box>
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography>Uploading and processing CSV file...</Typography>
                </Box>
              ) : (
                <>
                  <CloudUploadIcon
                    sx={{
                      fontSize: 64,
                      color: 'text.secondary',
                      mb: 2,
                    }}
                  />
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Drag and drop files here or
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    sx={{
                      bgcolor: 'grey.100',
                      color: 'text.primary',
                      borderColor: 'grey.300',
                      '&:hover': {
                        bgcolor: 'grey.200',
                        borderColor: 'grey.400',
                      },
                    }}
                  >
                    Browse Files
                  </Button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel - Help Documents */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Help Documents
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              You can use these documents to generate your CSV file
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<DescriptionIcon />}
                onClick={() => handleDownload('categories')}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  bgcolor: 'grey.100',
                  borderColor: 'grey.300',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'grey.200',
                    borderColor: 'grey.400',
                  },
                }}
              >
                Category Ids list
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload('template')}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  bgcolor: 'grey.100',
                  borderColor: 'grey.300',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'grey.200',
                    borderColor: 'grey.400',
                  },
                }}
              >
                Download CSV Template
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload('example')}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  bgcolor: 'grey.100',
                  borderColor: 'grey.300',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'grey.200',
                    borderColor: 'grey.400',
                  },
                }}
              >
                Download CSV Example
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<DescriptionIcon />}
                onClick={() => {
                  // Open documentation (could be a modal or external link)
                  alert('Documentation will open in a new window');
                }}
                sx={{
                  justifyContent: 'flex-start',
                  py: 1.5,
                  bgcolor: 'grey.100',
                  borderColor: 'grey.300',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'grey.200',
                    borderColor: 'grey.400',
                  },
                }}
              >
                Documentation
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
