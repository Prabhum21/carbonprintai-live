import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GrassIcon from '@mui/icons-material/Grass';

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <GrassIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Welcome to CarbonWise AI
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your AI-powered sustainability companion. Track, understand, and reduce your carbon footprint with personalized insights and intelligent recommendations.
        </Typography>
        <Box sx={{ mt: 4, gap: 2, display: 'flex' }}>
          <Button variant="contained" size="large" onClick={() => navigate('/calculator')}>
            Calculate My Footprint
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/login')}>
            Get Started
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
