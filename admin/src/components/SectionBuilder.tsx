import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { Section } from '../types';
import SectionEditor from './SectionEditor';

interface SectionBuilderProps {
  pageId: string;
  sections: Section[];
  onChange: (sections: Section[]) => void;
  onPageCreated?: (pageId: string) => void;
}

export default function SectionBuilder({
  pageId,
  sections,
  onChange,
  onPageCreated,
}: SectionBuilderProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [newSectionType, setNewSectionType] = useState<'HERO' | 'TEXT' | 'IMAGE' | 'CTA' | 'FAQ'>('TEXT');

  useEffect(() => {
    if (pageId && sections.length > 0) {
      fetchSections();
    }
  }, [pageId]);

  const fetchSections = async () => {
    try {
      const response = await axios.get(`/sections/page/${pageId}`);
      onChange(response.data);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    }
  };

  const handleAddSection = async () => {
    if (!pageId) {
      alert('Please save the page first before adding sections');
      return;
    }

    const defaultContent = getDefaultContent(newSectionType);
    const newOrder = sections.length;

    try {
      const response = await axios.post('/sections', {
        pageId,
        type: newSectionType,
        order: newOrder,
        content: defaultContent,
      });
      onChange([...sections, response.data]);
      setOpenDialog(false);
    } catch (error: any) {
      console.error('Failed to create section:', error);
      alert(error.response?.data?.message || 'Failed to create section');
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    try {
      await axios.delete(`/sections/${sectionId}`);
      onChange(sections.filter((s) => s.id !== sectionId));
    } catch (error) {
      console.error('Failed to delete section:', error);
      alert('Failed to delete section');
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
  };

  const handleSaveSection = async (updatedContent: Record<string, any>) => {
    if (!editingSection) return;

    try {
      const response = await axios.patch(`/sections/${editingSection.id}`, {
        content: updatedContent,
      });
      onChange(
        sections.map((s) => (s.id === editingSection.id ? response.data : s))
      );
      setEditingSection(null);
    } catch (error) {
      console.error('Failed to update section:', error);
      alert('Failed to update section');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !pageId) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order in backend
    const reorderedSections = items.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    try {
      await axios.post('/sections/reorder', { sections: reorderedSections });
      onChange(items.map((item, index) => ({ ...item, order: index })));
    } catch (error) {
      console.error('Failed to reorder sections:', error);
      alert('Failed to reorder sections');
    }
  };

  const getDefaultContent = (type: string): Record<string, any> => {
    switch (type) {
      case 'HERO':
        return {
          heading: 'Welcome',
          subheading: 'Enter your subheading here',
          image: '',
          buttonText: 'Get Started',
          buttonLink: '/',
        };
      case 'TEXT':
        return {
          title: 'Section Title',
          content: '<p>Enter your content here</p>',
        };
      case 'IMAGE':
        return {
          image: '',
          alt: '',
          caption: '',
        };
      case 'CTA':
        return {
          title: 'Call to Action',
          description: 'Description text',
          buttonText: 'Click Here',
          buttonLink: '/',
        };
      case 'FAQ':
        return {
          items: [
            { question: 'Question 1?', answer: 'Answer 1' },
          ],
        };
      default:
        return {};
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Sections</Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          disabled={!pageId}
        >
          Add Section
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}
                    >
                      <Box {...provided.dragHandleProps}>
                        <DragIcon />
                      </Box>
                      <Box flex={1}>
                        <Typography variant="subtitle1">
                          {section.type} - Order: {section.order}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditSection(section)}
                      >
                        Edit
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      {sections.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          No sections yet. Add your first section to get started.
        </Typography>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Section Type</InputLabel>
            <Select
              value={newSectionType}
              onChange={(e) => setNewSectionType(e.target.value as any)}
              label="Section Type"
            >
              <MenuItem value="HERO">Hero</MenuItem>
              <MenuItem value="TEXT">Text</MenuItem>
              <MenuItem value="IMAGE">Image</MenuItem>
              <MenuItem value="CTA">Call to Action</MenuItem>
              <MenuItem value="FAQ">FAQ</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSection} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {editingSection && (
        <SectionEditor
          section={editingSection}
          open={true}
          onClose={() => setEditingSection(null)}
          onSave={handleSaveSection}
        />
      )}
    </Paper>
  );
}
