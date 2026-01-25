import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Divider,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Menu as MenuIcon,
  Edit as EditIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { Post, Category } from '../types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function PostEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [post, setPost] = useState<Partial<Post & { metaKeywords?: string; imageDescription?: string; optionalUrl?: string; isRegisteredOnly?: boolean; scheduledDate?: string }>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    imageDescription: '',
    metaKeywords: '',
    optionalUrl: '',
    status: 'DRAFT',
    publishedAt: undefined,
    isSlider: false,
    isFeatured: false,
    isBreaking: false,
    isRecommended: false,
    isRegisteredOnly: false,
    categoryId: '',
    scheduledDate: '',
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (!isNew) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  useEffect(() => {
    if (post.title && !slugManuallyEdited && (isNew || !post.slug)) {
      const autoSlug = generateSlug(post.title);
      setPost({ ...post, slug: autoSlug });
    }
  }, [post.title, isNew]); // eslint-disable-line react-hooks/exhaustive-deps

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
      setSlugManuallyEdited(false);
      if (response.data.tags) {
        setTags(Array.isArray(response.data.tags) ? response.data.tags : []);
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
      alert('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPost({ ...post, featuredImage: response.data.url });
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('File uploaded successfully! URL: ' + response.data.url);
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

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
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleFileSelectForUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async (status?: 'DRAFT' | 'PUBLISHED' | 'PENDING') => {
    if (!post.title || !post.slug) {
      alert('Please fill in Title and Slug fields');
      return;
    }

    setSaving(true);
    try {
      const finalStatus = status || (isScheduled ? 'SCHEDULED' : post.status);
      const payload = {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        imageDescription: post.imageDescription,
        metaKeywords: post.metaKeywords,
        status: finalStatus,
        publishedAt: isScheduled && post.scheduledDate ? new Date(post.scheduledDate).toISOString() : post.publishedAt,
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

  const isVisible = post.status === 'PUBLISHED';

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          {isNew ? 'Add Article' : 'Edit Article'}
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
        {/* Left Column - Post Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Post Details
            </Typography>

            <TextField
              fullWidth
              label="Title"
              placeholder="Title"
              value={post.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                if (!slugManuallyEdited) {
                  const autoSlug = generateSlug(newTitle);
                  setPost({ ...post, title: newTitle, slug: autoSlug });
                } else {
                  setPost({ ...post, title: newTitle });
                }
              }}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Slug"
              placeholder="Slug"
              value={post.slug}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                setPost({ ...post, slug: e.target.value });
              }}
              margin="normal"
              helperText="(If you leave it blank, it will be generated automatically.)"
            />

            <TextField
              fullWidth
              label="Summary & Description (Meta Tag)"
              placeholder="Summary & Description (Meta Tag)"
              multiline
              rows={4}
              value={post.excerpt || ''}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Keywords (Meta Tag)"
              placeholder="Keywords (Meta Tag)"
              value={post.metaKeywords || ''}
              onChange={(e) => setPost({ ...post, metaKeywords: e.target.value })}
              margin="normal"
              helperText="Separate keywords with commas"
            />

            <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
              <FormLabel component="legend">Visibility</FormLabel>
              <RadioGroup
                row
                value={isVisible ? 'show' : 'hide'}
                onChange={(e) =>
                  setPost({
                    ...post,
                    status: e.target.value === 'show' ? 'PUBLISHED' : 'DRAFT',
                  })
                }
              >
                <FormControlLabel value="show" control={<Radio />} label="Show" />
                <FormControlLabel value="hide" control={<Radio />} label="Hide" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={post.isSlider || false}
                    onChange={(e) => setPost({ ...post, isSlider: e.target.checked })}
                  />
                }
                label="Add to Slider"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={post.isFeatured || false}
                    onChange={(e) => setPost({ ...post, isFeatured: e.target.checked })}
                  />
                }
                label="Add to Featured"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={post.isBreaking || false}
                    onChange={(e) => setPost({ ...post, isBreaking: e.target.checked })}
                  />
                }
                label="Add to Breaking"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={post.isRecommended || false}
                    onChange={(e) => setPost({ ...post, isRecommended: e.target.checked })}
                  />
                }
                label="Add to Recommended"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={post.isRegisteredOnly || false}
                    onChange={(e) => setPost({ ...post, isRegisteredOnly: e.target.checked })}
                  />
                }
                label="Show Only to Registered Users"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Tags Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Type tag and hit enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  size="small"
                />
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  sx={{ minWidth: 140 }}
                >
                  Manage Tags
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            {/* Optional URL */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Optional URL
              </Typography>
              <TextField
                fullWidth
                placeholder="Optional URL"
                value={post.optionalUrl || ''}
                onChange={(e) => setPost({ ...post, optionalUrl: e.target.value })}
                size="small"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Content Section */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Content
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ImageIcon />}
                  onClick={() => {
                    // This would typically open an image picker
                    alert('Image picker functionality - to be integrated');
                  }}
                >
                  Add Image
                </Button>
              </Box>
              <ReactQuill
                value={post.content || ''}
                onChange={(value) => setPost({ ...post, content: value })}
                style={{ minHeight: '400px', marginBottom: '50px' }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Image Description */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <TextField
              fullWidth
              label="Image Description"
              placeholder="Image Description"
              value={post.imageDescription || ''}
              onChange={(e) => setPost({ ...post, imageDescription: e.target.value })}
              margin="normal"
            />
          </Paper>

          {/* Additional Images */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Additional Images
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              (More main images (slider will be active))
            </Typography>
            <Button
              variant="contained"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{ bgcolor: '#7b1fa2', '&:hover': { bgcolor: '#6a1b9a' } }}
              onClick={() => fileInputRef.current?.click()}
            >
              Select Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </Paper>

          {/* Files Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Files
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Downloadable additional files (.pdf, .docx, .zip etc..)
            </Typography>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AttachFileIcon />}
              sx={{ bgcolor: '#7b1fa2', '&:hover': { bgcolor: '#6a1b9a' } }}
              onClick={() => fileUploadRef.current?.click()}
            >
              Select File
            </Button>
            <input
              ref={fileUploadRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileSelectForUpload}
            />
          </Paper>

          {/* Category Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Category
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Language</InputLabel>
              <Select value="english" label="Language">
                <MenuItem value="english">English</MenuItem>
                <MenuItem value="hindi">Hindi</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={post.categoryId || ''}
                onChange={(e) => setPost({ ...post, categoryId: e.target.value })}
                label="Category"
              >
                <MenuItem value="">
                  <em>Select a category</em>
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
              <InputLabel>Subcategory</InputLabel>
              <Select value="" label="Subcategory">
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
              </Select>
            </FormControl>
          </Paper>

          {/* Publish Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Publish
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                />
              }
              label="Scheduled Post"
              sx={{ mb: 2 }}
            />
            {isScheduled && (
              <TextField
                fullWidth
                type="datetime-local"
                label="Schedule Date & Time"
                value={post.scheduledDate || ''}
                onChange={(e) => setPost({ ...post, scheduledDate: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleSave('DRAFT')}
                disabled={saving}
                sx={{
                  bgcolor: '#ff9800',
                  color: 'white',
                  borderColor: '#ff9800',
                  '&:hover': {
                    bgcolor: '#f57c00',
                    borderColor: '#f57c00',
                  },
                }}
              >
                Save as Draft
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleSave('PENDING')}
                disabled={saving || !post.title || !post.slug}
                sx={{
                  bgcolor: '#2196f3',
                  '&:hover': { bgcolor: '#1976d2' },
                }}
              >
                Submit
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
