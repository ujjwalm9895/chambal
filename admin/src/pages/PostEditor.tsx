import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { Post, Category } from '../types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [categories, setCategories] = useState<Category[]>([]);
  const [post, setPost] = useState<Partial<Post>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    status: 'DRAFT',
    publishedAt: undefined,
    isSlider: false,
    isFeatured: false,
    isBreaking: false,
    isRecommended: false,
    categoryId: '',
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (!isNew) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
      alert('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!post.title || !post.slug) {
      alert('Please fill in Title and Slug fields');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        status: post.status,
        publishedAt: post.publishedAt,
        isSlider: post.isSlider,
        isFeatured: post.isFeatured,
        isBreaking: post.isBreaking,
        isRecommended: post.isRecommended,
        categoryId: post.categoryId || null,
      };

      if (isNew) {
        const response = await axios.post('/posts', payload);
        navigate(`/posts/${response.data.id}`);
      } else {
        await axios.patch(`/posts/${id}`, payload);
      }
      alert('Post saved successfully!');
    } catch (error: any) {
      console.error('Failed to save post:', error);
      alert(error.response?.data?.message || 'Failed to save post');
    } finally {
      setSaving(false);
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
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate('/posts')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {isNew ? 'Create New Post' : 'Edit Post'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Post Details
            </Typography>
            <TextField
              fullWidth
              label="Title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Slug"
              value={post.slug}
              onChange={(e) => setPost({ ...post, slug: e.target.value })}
              margin="normal"
              required
              helperText="URL-friendly identifier (e.g., 'my-first-blog-post')"
            />
            <TextField
              fullWidth
              label="Featured Image URL"
              value={post.featuredImage || ''}
              onChange={(e) => setPost({ ...post, featuredImage: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Excerpt"
              multiline
              rows={3}
              value={post.excerpt || ''}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={post.categoryId || ''}
                onChange={(e) => setPost({ ...post, categoryId: e.target.value })}
                label="Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ width: 10, height: 10, bgcolor: cat.color, borderRadius: '50%' }} />
                      {cat.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={post.status}
                onChange={(e) => setPost({ ...post, status: e.target.value as any })}
                label="Status"
              >
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="PUBLISHED">Published</MenuItem>
                <MenuItem value="SCHEDULED">Scheduled</MenuItem>
              </Select>
            </FormControl>
            <Box mt={2}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Content
              </Typography>
              <ReactQuill
                value={post.content || ''}
                onChange={(value) => setPost({ ...post, content: value })}
                style={{ minHeight: '300px', marginBottom: '50px' }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Display Options
            </Typography>
            <Box display="flex" flexDirection="column">
              <FormControlLabel
                control={
                  <Switch
                    checked={post.isSlider || false}
                    onChange={(e) => setPost({ ...post, isSlider: e.target.checked })}
                  />
                }
                label="Add to Slider"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={post.isFeatured || false}
                    onChange={(e) => setPost({ ...post, isFeatured: e.target.checked })}
                  />
                }
                label="Featured Post"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={post.isBreaking || false}
                    onChange={(e) => setPost({ ...post, isBreaking: e.target.checked })}
                  />
                }
                label="Breaking News"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={post.isRecommended || false}
                    onChange={(e) => setPost({ ...post, isRecommended: e.target.checked })}
                  />
                }
                label="Recommended"
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Publish Settings
            </Typography>
            <TextField
              fullWidth
              label="Published At"
              type="datetime-local"
              value={post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ''}
              onChange={(e) => setPost({ ...post, publishedAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Paper>
          <Box mt={3}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving || !post.title || !post.slug}
            >
              {saving ? 'Saving...' : 'Save Post'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
