import { useEffect, useState } from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import {
  Article as ArticleIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import DashboardCard from '../components/DashboardCard';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    pendingPosts: 0,
    drafts: 0,
    scheduled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/posts/stats'); // Fetch stats from new posts API
        const { totalPosts, pendingPosts, drafts, scheduled } = response.data;

        setStats({
          totalPosts,
          pendingPosts,
          drafts,
          scheduled,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: <ArticleIcon />,
      color: '#2e7d32',
      bgColor: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
    },
    {
      title: 'Pending Posts',
      value: stats.pendingPosts,
      icon: <VisibilityIcon />,
      color: '#d32f2f',
      bgColor: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
    },
    {
      title: 'Drafts',
      value: stats.drafts,
      icon: <EditIcon />,
      color: '#7b1fa2',
      bgColor: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
    },
    {
      title: 'Scheduled',
      value: stats.scheduled,
      icon: <ScheduleIcon />,
      color: '#f57c00',
      bgColor: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)',
    },
  ];

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 3,
          color: 'text.primary',
        }}
      >
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} lg={3} key={card.title}>
            <DashboardCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              bgColor={card.bgColor}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
