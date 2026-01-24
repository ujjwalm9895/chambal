import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { Post } from '../types';

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Build query string from searchParams
      const query = new URLSearchParams(searchParams);
      // Ensure we always fetch published posts unless status is specified
      // But the backend defaults to published if no status is provided
      // If we want to see ALL (including drafts) when "All Posts" is clicked, we might need a flag
      // However, typical CMS behavior:
      // "All Posts" -> Show everything (Published, Draft, Pending...)
      // The Sidebar links:
      // "Posts" -> /posts (Currently fetching published only by default in backend? No, backend defaults to Published if includeDrafts is false)
      // Let's explicitly add includeDrafts=true for the general list view if no status is filtered
      
      if (!query.has('status')) {
        query.append('includeDrafts', 'true');
      }

      const response = await axios.get(`/posts?${query.toString()}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  const getTitle = () => {
    if (searchParams.get('isSlider')) return 'Slider Posts';
    if (searchParams.get('isFeatured')) return 'Featured Posts';
    if (searchParams.get('isBreaking')) return 'Breaking News';
    if (searchParams.get('isRecommended')) return 'Recommended Posts';
    if (searchParams.get('status')) {
      const status = searchParams.get('status');
      return status ? `${status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()} Posts` : 'Posts';
    }
    return 'All Posts';
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
        <Typography variant="h4">{getTitle()}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/posts/new')}
        >
          New Post
        </Button>
      </Box>

      {posts.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No posts found.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click "New Post" to create your first post.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Flags</TableCell>
                <TableCell>Published At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} hover>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.slug}</TableCell>
                  <TableCell>
                    <Chip
                      label={post.status}
                      color={post.status === 'PUBLISHED' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {post.isSlider && <Chip label="Slider" size="small" color="primary" variant="outlined" />}
                      {post.isFeatured && <Chip label="Featured" size="small" color="secondary" variant="outlined" />}
                      {post.isBreaking && <Chip label="Breaking" size="small" color="error" variant="outlined" />}
                      {post.isRecommended && <Chip label="Recommended" size="small" color="info" variant="outlined" />}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/posts/${post.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(post.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
