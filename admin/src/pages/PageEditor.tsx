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
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { Page, Section } from '../types';
import SectionBuilder from '../components/SectionBuilder';
import SEOEditor from '../components/SEOEditor';

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export default function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [page, setPage] = useState<Partial<Page>>({
    title: '',
    slug: '',
    status: 'DRAFT',
    seoTitle: '',
    seoDescription: '',
  });
  const [sections, setSections] = useState<Section[]>([]);
  // Track if we just saved to prevent unnecessary fetches
  const [justSaved, setJustSaved] = useState(false);
  // For new pages, loading should always be false
  const [loading, setLoading] = useState(isNew ? false : true);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    // For new pages, don't fetch anything
    if (isNew) {
      setLoading(false);
      setJustSaved(false);
      return;
    }
    
    // If we just saved, don't fetch - we already have the data
    if (justSaved && page.id === id) {
      setLoading(false);
      setJustSaved(false);
      return;
    }
    
    // Only fetch if we have a valid ID and don't have page data
    if (id && id !== 'new' && (!page.id || page.id !== id)) {
      fetchPage();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-generate slug from title when title changes (only if slug hasn't been manually edited)
  useEffect(() => {
    if (page.title && !slugManuallyEdited && (isNew || !page.slug)) {
      const autoSlug = generateSlug(page.title);
      setPage({ ...page, slug: autoSlug });
    }
  }, [page.title, isNew]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPage = async () => {
    if (!id || id === 'new') {
      setLoading(false);
      return;
    }
    
    // If we already have page data with this ID, don't fetch again
    if (page.id === id && page.title) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`/pages/${id}`);
      setPage(response.data);
      setSections(response.data.sections || []);
      setSlugManuallyEdited(false); // Reset flag when loading existing page
    } catch (error: any) {
      console.error('Failed to fetch page:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load page';
      
      if (error.response?.status === 401) {
        alert('You are not authorized. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 404) {
        // If we have page data already, don't show error (might be timing issue after save)
        if (!page.id || page.id !== id) {
          // Only redirect if we don't have the page data
          console.warn('Page not found, redirecting to pages list');
          navigate('/pages');
        } else {
          // We have page data from save, just log the warning - don't show error
          console.warn('Page fetch returned 404 but we have local data - this is OK after save');
          setLoading(false);
        }
      } else {
        alert(`Failed to load page: ${errorMessage}\n\nPlease check:\n1. Backend is running\n2. You are logged in\n3. Page ID is valid`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!page.title || !page.slug) {
      alert('Please fill in Title and Slug fields');
      return;
    }

    setSaving(true);
    try {
      let savedPage;
      // If it's a new page AND we haven't saved it yet (no page.id), create it
      // Otherwise, update the existing page (using page.id)
      if (isNew && !page.id) {
        savedPage = await axios.post('/pages', {
          title: page.title,
          slug: page.slug,
          status: page.status || 'DRAFT',
          seoTitle: page.seoTitle || undefined,
          seoDescription: page.seoDescription || undefined,
        });
        
        // Get the saved page data
        const savedPageData = savedPage.data;
        
        // Mark that we just saved to prevent unnecessary fetch
        setJustSaved(true);
        
        // Update local state immediately with the saved data (including ID)
        setPage({
          ...savedPageData,
          id: savedPageData.id,
        });
        
        if (savedPageData.sections) {
          setSections(savedPageData.sections);
        }
        
        // Update URL without navigation to avoid triggering useEffect
        // This keeps us on the same component instance
        window.history.replaceState({}, '', `/pages/${savedPageData.id}`);
        
        alert('Page saved successfully! You can now add sections.');
      } else {
        // Use page.id if available (from previous save), otherwise use id from params
        const targetId = page.id || id;
        savedPage = await axios.patch(`/pages/${targetId}`, {
          title: page.title,
          slug: page.slug,
          status: page.status,
          seoTitle: page.seoTitle || undefined,
          seoDescription: page.seoDescription || undefined,
        });
        setPage(savedPage.data);
        if (savedPage.data.sections) {
          setSections(savedPage.data.sections);
        }
        alert('Page updated successfully!');
      }
    } catch (error: any) {
      console.error('Failed to save page:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save page';
      
      if (error.response?.status === 401) {
        alert('You are not authorized. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 409) {
        alert(`Error: ${errorMessage}\n\nThis slug already exists. Please choose a different slug.`);
      } else if (error.response?.status === 404) {
        // 404 shouldn't happen on save - page should be created
        // This might indicate backend issue
        console.error('404 error on save - backend issue?', error);
        alert(`Error: Unable to save page. Please check:\n1. Backend is running on http://localhost:3000\n2. You are logged in\n3. Check browser console (F12) for details`);
      } else {
        alert(`Error: ${errorMessage}\n\nPlease check:\n1. Backend is running on http://localhost:3000\n2. You are logged in\n3. All required fields are filled\n4. Check browser console (F12) for more details`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSectionsChange = (updatedSections: Section[]) => {
    setSections(updatedSections);
  };

  // Only show loading for existing pages, not for new pages
  if (loading && !isNew) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading page...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate('/pages')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {isNew ? 'Create New Page' : 'Edit Page'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Page Details
            </Typography>
            <TextField
              fullWidth
              label="Title"
              value={page.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                // Auto-generate slug if it hasn't been manually edited
                if (!slugManuallyEdited) {
                  const autoSlug = generateSlug(newTitle);
                  setPage({ ...page, title: newTitle, slug: autoSlug });
                } else {
                  setPage({ ...page, title: newTitle });
                }
              }}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Slug"
              value={page.slug}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                setPage({ ...page, slug: e.target.value });
              }}
              margin="normal"
              required
              helperText="URL-friendly identifier (auto-generated from title, or edit manually)"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={page.status}
                onChange={(e) => setPage({ ...page, status: e.target.value as any })}
                label="Status"
              >
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="PUBLISHED">Published</MenuItem>
              </Select>
            </FormControl>
          </Paper>

          <SectionBuilder
            pageId={page.id || id || ''}
            sections={sections}
            onChange={handleSectionsChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <SEOEditor
            seoTitle={page.seoTitle || ''}
            seoDescription={page.seoDescription || ''}
            onChange={(seoTitle, seoDescription) =>
              setPage({ ...page, seoTitle, seoDescription })
            }
          />
          <Box mt={3}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving || !page.title || !page.slug}
            >
              {saving ? 'Saving...' : 'Save Page'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
