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
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    try {
      const response = await axios.get(`/pages/${id}`);
      setPage(response.data);
      setSections(response.data.sections || []);
    } catch (error) {
      console.error('Failed to fetch page:', error);
      alert('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let savedPage;
      if (isNew) {
        savedPage = await axios.post('/pages', page);
        navigate(`/pages/${savedPage.data.id}`);
      } else {
        savedPage = await axios.patch(`/pages/${id}`, page);
      }
      setPage(savedPage.data);
      alert('Page saved successfully!');
    } catch (error: any) {
      console.error('Failed to save page:', error);
      alert(error.response?.data?.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const handleSectionsChange = (updatedSections: Section[]) => {
    setSections(updatedSections);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
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
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Slug"
              value={page.slug}
              onChange={(e) => setPage({ ...page, slug: e.target.value })}
              margin="normal"
              required
              helperText="URL-friendly identifier (e.g., 'about-us')"
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
            pageId={isNew ? '' : id!}
            sections={sections}
            onChange={handleSectionsChange}
            onPageCreated={isNew ? (pageId) => {
              setPage({ ...page, id: pageId });
            } : undefined}
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
