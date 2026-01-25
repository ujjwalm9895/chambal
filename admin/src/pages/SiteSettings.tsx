import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface SiteSettings {
  brandName?: string;
  aboutUs?: string;
  contactEmail?: string;
  copyrightText?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  pinterestUrl?: string;
  linkedinUrl?: string;
  rssUrl?: string;
  newsletterTitle?: string;
  newsletterDescription?: string;
  contactFormTitle?: string;
  contactFormSubtitle?: string;
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/site-settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value || '',
      }));

      await Promise.all(
        updates.map((update) =>
          axios.post('/site-settings/upsert', {
            key: update.key,
            value: update.value,
          })
        )
      );

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: string) => {
    setSettings({ ...settings, [key]: value });
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
        <Typography variant="h4" fontWeight="bold">
          Site Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              General Settings
            </Typography>
            <TextField
              fullWidth
              label="Brand Name / Logo Text"
              value={settings.brandName || ''}
              onChange={(e) => updateSetting('brandName', e.target.value)}
              margin="normal"
              helperText="This text appears in the header and footer logo (e.g., Chambal Sandesh)"
            />
            <TextField
              fullWidth
              label="About Us Text"
              multiline
              rows={4}
              value={settings.aboutUs || ''}
              onChange={(e) => updateSetting('aboutUs', e.target.value)}
              margin="normal"
              helperText="This text appears in the footer About Us section"
            />
            <TextField
              fullWidth
              label="Copyright Text"
              value={settings.copyrightText || ''}
              onChange={(e) => updateSetting('copyrightText', e.target.value)}
              margin="normal"
              helperText="Leave empty to use default: 'Copyright {year} Chambal Sandesh - All Rights Reserved.'"
            />
          </Paper>
        </Grid>

        {/* Contact Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Settings
            </Typography>
            <TextField
              fullWidth
              label="Contact Email"
              type="email"
              value={settings.contactEmail || ''}
              onChange={(e) => updateSetting('contactEmail', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Contact Form Title"
              value={settings.contactFormTitle || ''}
              onChange={(e) => updateSetting('contactFormTitle', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Contact Form Subtitle"
              value={settings.contactFormSubtitle || ''}
              onChange={(e) => updateSetting('contactFormSubtitle', e.target.value)}
              margin="normal"
            />
          </Paper>
        </Grid>

        {/* Social Media */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Social Media Links
            </Typography>
            <TextField
              fullWidth
              label="Facebook URL"
              value={settings.facebookUrl || ''}
              onChange={(e) => updateSetting('facebookUrl', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Twitter/X URL"
              value={settings.twitterUrl || ''}
              onChange={(e) => updateSetting('twitterUrl', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Instagram URL"
              value={settings.instagramUrl || ''}
              onChange={(e) => updateSetting('instagramUrl', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Pinterest URL"
              value={settings.pinterestUrl || ''}
              onChange={(e) => updateSetting('pinterestUrl', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="LinkedIn URL"
              value={settings.linkedinUrl || ''}
              onChange={(e) => updateSetting('linkedinUrl', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="RSS URL"
              value={settings.rssUrl || ''}
              onChange={(e) => updateSetting('rssUrl', e.target.value)}
              margin="normal"
            />
          </Paper>
        </Grid>

        {/* Newsletter */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Newsletter Settings
            </Typography>
            <TextField
              fullWidth
              label="Newsletter Title"
              value={settings.newsletterTitle || ''}
              onChange={(e) => updateSetting('newsletterTitle', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Newsletter Description"
              multiline
              rows={3}
              value={settings.newsletterDescription || ''}
              onChange={(e) => updateSetting('newsletterDescription', e.target.value)}
              margin="normal"
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
