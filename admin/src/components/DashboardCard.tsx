import { Box, Typography, Paper } from '@mui/material';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  bgColor: string;
  onClick?: () => void;
}

export default function DashboardCard({ title, value, icon, bgColor, onClick }: DashboardCardProps) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: bgColor,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        height: 140,
        borderRadius: 1,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        }
      }}
    >
      <Box sx={{ zIndex: 1 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ fontSize: '2.5rem', mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9, fontSize: '1.1rem', fontWeight: 500 }}>
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          right: 15,
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.3,
          color: '#000',
          '& svg': {
            fontSize: '5rem',
          }
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
}
