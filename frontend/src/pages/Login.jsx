import { useState } from 'react';
import {
  Box, Typography, Button, Container, Paper,
  TextField, Divider, Alert
} from '@mui/material';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import GoogleLogin from '../components/GoogleLogin';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async () => {
    setError('');
    try {
      if (isSignUp) {
        // Create account, then save to Firestore
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        await setDoc(doc(db, 'users', user.uid), {
          name: email.split('@')[0],
          email: user.email,
          greenScore: 0,
          createdAt: serverTimestamp(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" mb={1}>
            {isSignUp ? 'Create Account' : 'Sign In to CarbonWise'}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={3}>
            {isSignUp ? 'Join and start your green journey.' : 'Welcome back!'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            id="email-auth-btn"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleEmailAuth}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          {/* Google Login Component — handles Firestore saving too */}
          <GoogleLogin />

          <Button
            id="toggle-auth-mode-btn"
            variant="text"
            size="small"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
