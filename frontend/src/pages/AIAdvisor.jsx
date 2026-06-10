import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, TextField,
  Button, CircularProgress, Divider, List,
  ListItem, ListItemIcon, ListItemText, Alert, Chip
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;

function AIAdvisor() {
  const location = useLocation();
  const prefilled = location.state || {};

  const [query, setQuery]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [result, setResult]       = useState(null);

  // Auto-run analysis if coming from Calculator with data
  useEffect(() => {
    if (prefilled.transport) {
      handleAnalyze();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/advisor`, {
        transport: prefilled.transport,
        electricity: prefilled.electricity,
        food: prefilled.food,
        waste: prefilled.waste,
      });
      setResult(response.data);
    } catch (err) {
      setError('Could not reach the AI backend. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/advisor`, { query });
      setResult({ summary: response.data.response, tips: [], weeklyPlan: [] });
    } catch (err) {
      setError('Could not reach the AI backend. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: 36 }} />
          <Typography variant="h4" fontWeight="bold">AI Eco Coach</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Powered by Google Gemini AI — get personalized sustainability advice.
        </Typography>

        {prefilled.transport && (
          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={`🚗 ${prefilled.transport}`} color="primary" />
            <Chip label={`⚡ ${prefilled.electricity} kWh`} variant="outlined" />
            <Chip label={`🥗 ${prefilled.food}`} variant="outlined" />
            <Chip label={`🗑️ ${prefilled.waste}`} variant="outlined" />
            {prefilled.score && <Chip label={`Score: ${prefilled.score}`} color="secondary" />}
          </Box>
        )}

        {/* Free-text question */}
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Ask anything — e.g. 'How can I reduce my electricity bill and carbon footprint?'"
          inputProps={{ 'aria-label': 'Ask AI a question' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            id="ask-ai-btn"
            variant="contained"
            onClick={handleAskQuestion}
            disabled={loading || !query.trim()}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
          >
            Ask AI
          </Button>
          {prefilled.transport && (
            <Button
              id="analyze-profile-btn"
              variant="outlined"
              onClick={handleAnalyze}
              disabled={loading}
            >
              Re-Analyze My Profile
            </Button>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {/* Result */}
        {result && !loading && (
          <Box>
            {/* Summary */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3, borderColor: 'primary.main', bgcolor: 'background.default' }}>
              <Typography variant="h6" color="primary.main" gutterBottom>🌿 AI Analysis</Typography>
              <Typography variant="body1">{result.summary}</Typography>
            </Paper>

            {/* Tips */}
            {result.tips && result.tips.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>💡 Personalized Tips</Typography>
                <List dense>
                  {result.tips.map((tip, i) => (
                    <ListItem key={i}>
                      <ListItemIcon><CheckCircleOutlineIcon color="success" /></ListItemIcon>
                      <ListItemText primary={tip} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Weekly Plan */}
            {result.weeklyPlan && result.weeklyPlan.length > 0 && (
              <Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  <CalendarMonthIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Weekly Sustainability Plan
                </Typography>
                <List dense>
                  {result.weeklyPlan.map((day, i) => (
                    <ListItem key={i} sx={{ bgcolor: i % 2 === 0 ? 'action.hover' : 'transparent', borderRadius: 1 }}>
                      <ListItemText primary={day} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default AIAdvisor;
