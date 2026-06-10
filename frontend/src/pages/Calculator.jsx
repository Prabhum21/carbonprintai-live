import { useState } from 'react';
import {
  Box, Typography, Button, Container, Paper,
  FormControl, InputLabel, Select, MenuItem,
  TextField, Stepper, Step, StepLabel, Alert,
  Chip, CircularProgress, Divider
} from '@mui/material';
import NatureIcon from '@mui/icons-material/Nature';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;

const steps = ['Transport', 'Electricity & Food', 'Waste & Submit'];

// Local calculation (mirrors backend logic)
const transportScores = { bike: 10, train: 25, bus: 30, car: 70, flight: 100 };
const foodScores      = { veg: 20, mixed: 50, nonveg: 80 };
const wasteScores     = { low: 10, medium: 30, high: 50 };

function calcScore(transport, electricity, food, waste) {
  const t = transportScores[transport] || 0;
  const e = (parseFloat(electricity) || 0) * 0.85;
  const f = foodScores[food] || 0;
  const w = wasteScores[waste] || 0;
  return parseFloat((t + e + f + w).toFixed(2));
}

function getScoreLabel(score) {
  if (score < 100) return { label: 'Excellent 🌿', color: 'success' };
  if (score < 200) return { label: 'Good 🌱', color: 'info' };
  if (score < 300) return { label: 'Average ⚠️', color: 'warning' };
  return { label: 'High Impact 🔥', color: 'error' };
}

function Calculator() {
  const [activeStep, setActiveStep] = useState(0);
  const [transport, setTransport]   = useState('');
  const [electricity, setElectricity] = useState('');
  const [food, setFood]             = useState('');
  const [waste, setWaste]           = useState('');
  const [score, setScore]           = useState(null);
  const [loading, setLoading]       = useState(false);
  const [saved, setSaved]           = useState(false);
  const [error, setError]           = useState('');
  const navigate = useNavigate();

  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const finalScore = calcScore(transport, electricity, food, waste);
    setScore(finalScore);

    try {
      // Save to Firestore: footprints collection
      const user = auth.currentUser;
      await addDoc(collection(db, 'footprints'), {
        userId: user ? user.uid : 'guest',
        score: finalScore,
        transport,
        electricity: parseFloat(electricity) || 0,
        food,
        waste,
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      });
      setSaved(true);
      setActiveStep(3); // Result step
    } catch (err) {
      console.error('Firestore error:', err);
      setScore(finalScore);
      setActiveStep(3);
      setError('Score calculated but not saved (login required to save).');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAdvice = () => {
    navigate('/advisor', { state: { transport, electricity, food, waste, score } });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
          <NatureIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h4" fontWeight="bold">Carbon Calculator</Typography>
        </Box>

        {activeStep < 3 && (
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
        )}

        {/* Step 0 — Transport */}
        {activeStep === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6">How do you primarily commute?</Typography>
            <FormControl fullWidth required>
              <InputLabel>Transportation Mode</InputLabel>
              <Select id="transport-select" value={transport} label="Transportation Mode" onChange={(e) => setTransport(e.target.value)}>
                <MenuItem value="bike">🚴 Bike</MenuItem>
                <MenuItem value="bus">🚌 Bus</MenuItem>
                <MenuItem value="train">🚆 Train</MenuItem>
                <MenuItem value="car">🚗 Car</MenuItem>
                <MenuItem value="flight">✈️ Flight</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" disabled={!transport} onClick={handleNext}>Next →</Button>
          </Box>
        )}

        {/* Step 1 — Electricity & Food */}
        {activeStep === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6">Energy & Food habits</Typography>
            <TextField
              id="electricity-input"
              label="Monthly Electricity Usage (kWh/Units)"
              type="number"
              fullWidth
              value={electricity}
              onChange={(e) => setElectricity(e.target.value)}
            />
            <FormControl fullWidth required>
              <InputLabel>Food Habits</InputLabel>
              <Select id="food-select" value={food} label="Food Habits" onChange={(e) => setFood(e.target.value)}>
                <MenuItem value="veg">🥦 Vegetarian</MenuItem>
                <MenuItem value="mixed">🍱 Mixed Diet</MenuItem>
                <MenuItem value="nonveg">🍖 Non-Vegetarian</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleBack}>← Back</Button>
              <Button variant="contained" disabled={!food || !electricity} onClick={handleNext}>Next →</Button>
            </Box>
          </Box>
        )}

        {/* Step 2 — Waste */}
        {activeStep === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6">Waste Generation</Typography>
            <FormControl fullWidth required>
              <InputLabel>Waste Level</InputLabel>
              <Select id="waste-select" value={waste} label="Waste Level" onChange={(e) => setWaste(e.target.value)}>
                <MenuItem value="low">♻️ Low</MenuItem>
                <MenuItem value="medium">🗑️ Medium</MenuItem>
                <MenuItem value="high">⚠️ High</MenuItem>
              </Select>
            </FormControl>
            {error && <Alert severity="warning">{error}</Alert>}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleBack}>← Back</Button>
              <Button
                id="calculate-btn"
                variant="contained"
                disabled={!waste || loading}
                onClick={handleSubmit}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {loading ? 'Calculating...' : 'Calculate & Save'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Result */}
        {activeStep === 3 && score !== null && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>Your Carbon Score</Typography>
            <Typography variant="h1" color="primary.main" fontWeight="bold">
              {score}
            </Typography>
            <Chip
              label={getScoreLabel(score).label}
              color={getScoreLabel(score).color}
              sx={{ mt: 1, mb: 3, fontSize: 16, py: 2, px: 1 }}
            />

            {/* Breakdown */}
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3, flexWrap: 'wrap', gap: 1 }}>
              <Chip label={`🚗 Transport: ${transportScores[transport] || 0}`} variant="outlined" />
              <Chip label={`⚡ Electricity: ${((parseFloat(electricity)||0)*0.85).toFixed(1)}`} variant="outlined" />
              <Chip label={`🥗 Food: ${foodScores[food] || 0}`} variant="outlined" />
              <Chip label={`🗑️ Waste: ${wasteScores[waste] || 0}`} variant="outlined" />
            </Box>

            {saved && <Alert severity="success" sx={{ mb: 2 }}>✅ Result saved to your history!</Alert>}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={handleGetAdvice}>
                🤖 Get AI Advice
              </Button>
              <Button variant="outlined" onClick={() => navigate('/dashboard')}>
                📊 View Dashboard
              </Button>
              <Button variant="text" onClick={() => { setActiveStep(0); setScore(null); setSaved(false); }}>
                Recalculate
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Calculator;
