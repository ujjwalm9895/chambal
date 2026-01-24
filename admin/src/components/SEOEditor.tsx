import { Paper, Typography, TextField } from '@mui/material';

interface SEOEditorProps {
  seoTitle: string;
  seoDescription: string;
  onChange: (title: string, description: string) => void;
}

export default function SEOEditor({ seoTitle, seoDescription, onChange }: SEOEditorProps) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        SEO Settings
      </Typography>
      <TextField
        fullWidth
        label="SEO Title"
        value={seoTitle}
        onChange={(e) => onChange(e.target.value, seoDescription)}
        margin="normal"
        helperText="Title for search engines"
      />
      <TextField
        fullWidth
        label="SEO Description"
        value={seoDescription}
        onChange={(e) => onChange(seoTitle, e.target.value)}
        margin="normal"
        multiline
        rows={3}
        helperText="Meta description for search engines"
      />
    </Paper>
  );
}
