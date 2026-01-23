import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Section } from '../types';

interface SectionEditorProps {
  section: Section;
  open: boolean;
  onClose: () => void;
  onSave: (content: Record<string, any>) => void;
}

export default function SectionEditor({
  section,
  open,
  onClose,
  onSave,
}: SectionEditorProps) {
  const [content, setContent] = useState<Record<string, any>>(section.content);

  useEffect(() => {
    setContent(section.content);
  }, [section]);

  const handleSave = () => {
    onSave(content);
  };

  const renderEditor = () => {
    switch (section.type) {
      case 'HERO':
        return (
          <Box>
            <TextField
              fullWidth
              label="Heading"
              value={content.heading || ''}
              onChange={(e) => setContent({ ...content, heading: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subheading"
              value={content.subheading || ''}
              onChange={(e) => setContent({ ...content, subheading: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Image URL"
              value={content.image || ''}
              onChange={(e) => setContent({ ...content, image: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Button Text"
              value={content.buttonText || ''}
              onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Button Link"
              value={content.buttonLink || ''}
              onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
              margin="normal"
            />
          </Box>
        );

      case 'TEXT':
        return (
          <Box>
            <TextField
              fullWidth
              label="Title"
              value={content.title || ''}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              margin="normal"
            />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Content
            </Typography>
            <ReactQuill
              value={content.content || ''}
              onChange={(value) => setContent({ ...content, content: value })}
              style={{ minHeight: '200px', marginBottom: '50px' }}
            />
          </Box>
        );

      case 'IMAGE':
        return (
          <Box>
            <TextField
              fullWidth
              label="Image URL"
              value={content.image || ''}
              onChange={(e) => setContent({ ...content, image: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Alt Text"
              value={content.alt || ''}
              onChange={(e) => setContent({ ...content, alt: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Caption"
              value={content.caption || ''}
              onChange={(e) => setContent({ ...content, caption: e.target.value })}
              margin="normal"
            />
          </Box>
        );

      case 'CTA':
        return (
          <Box>
            <TextField
              fullWidth
              label="Title"
              value={content.title || ''}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={content.description || ''}
              onChange={(e) => setContent({ ...content, description: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Button Text"
              value={content.buttonText || ''}
              onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Button Link"
              value={content.buttonLink || ''}
              onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
              margin="normal"
            />
          </Box>
        );

      case 'FAQ':
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              FAQ Items (JSON format)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={JSON.stringify(content.items || [], null, 2)}
              onChange={(e) => {
                try {
                  const items = JSON.parse(e.target.value);
                  setContent({ ...content, items });
                } catch {
                  // Invalid JSON, keep as is
                }
              }}
              margin="normal"
              helperText={'Format: [{"question": "...", "answer": "..."}]'}
            />
          </Box>
        );

      default:
        return <Typography>Unknown section type</Typography>;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit {section.type} Section</DialogTitle>
      <DialogContent>{renderEditor()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
