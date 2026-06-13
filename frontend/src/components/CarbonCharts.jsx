import React from 'react';
import { Typography, Grid, Paper, Box } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const COLORS = ['#2E7D32', '#66BB6A', '#FFA726', '#EF5350'];

export default function CarbonCharts({ trendData, pieData }) {
  return (
    <>
      {/* Trend Line Chart */}
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ p: 3, height: 320 }}>
          <Typography variant="h6" gutterBottom>📈 Score Trend</Typography>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2E7D32"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
              <Typography color="text.secondary">No data yet — use the Calculator first!</Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Pie Chart */}
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ p: 3, height: 320 }}>
          <Typography variant="h6" gutterBottom>🥧 Latest Breakdown</Typography>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
              <Typography color="text.secondary">No data yet</Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Bar chart of all scores */}
      {trendData.length > 1 && (
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, height: 280 }}>
            <Typography variant="h6" gutterBottom>📊 Score History</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#2E7D32" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      )}
    </>
  );
}
