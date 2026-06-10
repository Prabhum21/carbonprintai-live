import { useState } from 'react';
import { Box, Typography, Container, Paper, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const initialChallenges = [
  { id: 1, title: 'Walk 5 KM', description: 'Replace a short car trip with walking.', points: 50, completed: false },
  { id: 2, title: 'Plant a Tree', description: 'Contribute to reforestation by planting a tree locally.', points: 200, completed: false },
  { id: 3, title: 'No Plastic Day', description: 'Avoid single-use plastics for 24 hours.', points: 100, completed: false },
  { id: 4, title: 'Use Public Transport', description: 'Take the bus or train instead of driving.', points: 75, completed: true },
];

function Challenges() {
  const [challenges, setChallenges] = useState(initialChallenges);

  const handleComplete = (id) => {
    setChallenges(challenges.map(c => c.id === id ? { ...c, completed: true } : c));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Green Challenges</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Complete daily and weekly tasks to earn sustainability points and reduce your footprint.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {challenges.map((challenge) => (
          <Grid item xs={12} sm={6} md={4} key={challenge.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', 
              opacity: challenge.completed ? 0.7 : 1,
              border: challenge.completed ? '2px solid #4CAF50' : 'none'
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2">{challenge.title}</Typography>
                  {challenge.completed && <CheckCircleIcon color="success" />}
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {challenge.description}
                </Typography>
                <Chip label={`+${challenge.points} Points`} color="primary" variant={challenge.completed ? "filled" : "outlined"} />
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary" 
                  variant="contained" 
                  fullWidth
                  disabled={challenge.completed}
                  onClick={() => handleComplete(challenge.id)}
                >
                  {challenge.completed ? 'Completed' : 'Mark as Done'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Challenges;
