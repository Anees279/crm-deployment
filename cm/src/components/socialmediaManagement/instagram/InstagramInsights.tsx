import React, { Key, useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import InstagramIcon from '@mui/icons-material/Instagram'; // Material UI Instagram logo

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

interface InstagramData {
  followers_count: number;
  media_count: number;
  insights_basic: {
    id: Key | null | undefined;
    name: string;
    period: string;
    values: { value: number; end_time: string }[]; 
    title: string;
    description: string;
  }[]; 
  insights_total_value: {
    id: Key | null | undefined;
    name: string;
    period: string;
    title: string;
    description: string;
    total_value: { value: number };
  }[]; 
}

const InstagramInsights: React.FC = () => {
  const [data, setData] = useState<InstagramData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/instagram/insights'); // replace with your backend endpoint
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching Instagram data');
        setLoading(false);
      }
    };

    fetchInstagramData();
  }, []);

  // Line Chart Data
  const chartData = {
    labels: data?.insights_basic[0]?.values.map((val) => new Date(val.end_time).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Reach',
        data: data?.insights_basic[0]?.values.map((val) => val.value) || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', pt: 4 }}>
      {/* Header with Instagram Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
        <InstagramIcon fontSize="large" sx={{ mr: 2, color: 'linear-gradient(to right, #f58529, #dd2a7b, #8134af, #515bd4)' }} />
        <Typography variant="h4" fontWeight="bold">
          Instagram Insights
        </Typography>
      </Box>

      {/* Account Overview Section */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" fontWeight="bold">Account Overview</Typography>
          <Typography>Followers Count: {data?.followers_count}</Typography>
          <Typography>Media Count: {data?.media_count}</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" fontWeight="bold">Reach over Time</Typography>
          <Line data={chartData} />
        </Paper>
      </Box>

      {/* Insights Section */}
      <Box sx={{ mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold">Basic Insights</Typography>
          {data?.insights_basic.map((insight) => (
            <Box key={insight.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">{insight.title}</Typography>
              <Typography variant="body2">{insight.description}</Typography>
              <ul>
                {insight.values.map((value, index) => (
                  <li key={index}>
                    {new Date(value.end_time).toLocaleDateString()}: {value.value}
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </Paper>
      </Box>

      {/* Total Insights Section */}
      <Box>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold">Total Insights</Typography>
          {data?.insights_total_value.map((insight) => (
            <Box key={insight.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">{insight.title}</Typography>
              <Typography variant="body2">{insight.description}</Typography>
              <Typography variant="body2">Total: {insight.total_value.value}</Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default InstagramInsights;
