import { useEffect, useState } from 'react';
import {
  Box, Typography, Container, Grid, Paper,
  CircularProgress, Alert, LinearProgress, Chip
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
  collection, query, where, getDocs, limit
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const COLORS = ['#2E7D32', '#66BB6A', '#FFA726', '#EF5350'];

function greenScore(score) {
  // Convert raw score to 0-100 green score (lower footprint = higher green score)
  return Math.max(0, Math.round(100 - (score / 5)));
}

function Dashboard() {
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser]         = useState(null);
  const [error, setError]       = useState('');

  // Wait for Firebase Auth to initialize before doing anything
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady) return; // auth not ready yet

    const fetchRecords = async () => {
      setLoading(true);
      setError('');
      try {
        if (!user) {
          // Not logged in — no records to fetch
          setRecords([]);
          setLoading(false);
          return;
        }
        // Simple query — no orderBy so no composite index needed
        // We sort client-side instead
        const q = query(
          collection(db, 'footprints'),
          where('userId', '==', user.uid),
          limit(20)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort newest first (client-side)
        data.sort((a, b) => {
          const aTime = a.createdAt?.seconds ?? 0;
          const bTime = b.createdAt?.seconds ?? 0;
          return bTime - aTime;
        });
        setRecords(data);
      } catch (err) {
        console.error('Firestore error:', err);
        setError(`Could not load records: ${err.code || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [authReady, user]);

  // Derived metrics
  const latestScore = records[0]?.score ?? 0;
  const gs = greenScore(latestScore);
  const avgScore = records.length
    ? Math.round(records.reduce((a, r) => a + r.score, 0) / records.length)
    : 0;

  // Chart data — reverse so oldest first
  const trendData = [...records].reverse().map((r, i) => ({
    name: r.date || `Entry ${i + 1}`,
    score: r.score,
  }));

  // Breakdown of latest record for Pie chart
  const transportScores = { bike: 10, train: 25, bus: 30, car: 70, flight: 100 };
  const foodScores      = { veg: 20, mixed: 50, nonveg: 80 };
  const wasteScores     = { low: 10, medium: 30, high: 50 };

  const latest = records[0];
  const pieData = latest ? [
    { name: 'Transport',    value: transportScores[latest.transport] || 0 },
    { name: 'Electricity',  value: parseFloat((latest.electricity * 0.85).toFixed(1)) },
    { name: 'Food',         value: foodScores[latest.food] || 0 },
    { name: 'Waste',        value: wasteScores[latest.waste] || 0 },
  ] : [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 4, mb: 1 }}>
        📊 Your Carbon Dashboard
      </Typography>
      {!user && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You are not logged in. Log in to see your personal history.
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Green Score Card */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">Green Score</Typography>
            <Typography variant="h2" color="primary.main" fontWeight="bold" sx={{ my: 1 }}>
              {gs}
            </Typography>
            <Typography variant="caption" color="text.secondary">out of 100</Typography>
            <LinearProgress
              variant="determinate"
              value={gs}
              color={gs > 60 ? 'success' : gs > 40 ? 'warning' : 'error'}
              sx={{ mt: 2, height: 8, borderRadius: 4 }}
            />
          </Paper>
        </Grid>

        {/* Latest Score Card */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">Latest Carbon Score</Typography>
            <Typography variant="h2" fontWeight="bold" sx={{ my: 1 }}>
              {latestScore}
            </Typography>
            <Chip
              label={latestScore < 150 ? '🌿 Great' : latestScore < 250 ? '⚠️ Average' : '🔥 High'}
              color={latestScore < 150 ? 'success' : latestScore < 250 ? 'warning' : 'error'}
            />
          </Paper>
        </Grid>

        {/* Average Score Card */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">Avg Score (All Time)</Typography>
            <Typography variant="h2" fontWeight="bold" sx={{ my: 1 }}>
              {avgScore}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              From {records.length} calculation{records.length !== 1 ? 's' : ''}
            </Typography>
          </Paper>
        </Grid>

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
      </Grid>
    </Container>
  );
}

export default Dashboard;
