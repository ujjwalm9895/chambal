import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import {
  Pages as PagesIcon,
  Image as ImageIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { Page, Media, Menu } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState({
    pages: 0,
    media: 0,
    menus: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pagesRes, mediaRes, menusRes] = await Promise.all([
          axios.get('/pages?includeDrafts=true'),
          axios.get('/media'),
          axios.get('/menus'),
        ]);

        setStats({
          pages: pagesRes.data.length,
          media: mediaRes.data.length,
          menus: menusRes.data.length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Pages', value: stats.pages, icon: <PagesIcon />, color: '#1976d2' },
    { title: 'Media Files', value: stats.media, icon: <ImageIcon />, color: '#dc004e' },
    { title: 'Menus', value: stats.menus, icon: <MenuBookIcon />, color: '#2e7d32' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ color: card.color, fontSize: 40 }}>{card.icon}</Box>
                  <Box>
                    <Typography variant="h4">{card.value}</Typography>
                    <Typography color="text.secondary">{card.title}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
