// frontend/src/components/GoogleLogin.jsx
import { useState } from 'react';
import { Button, Alert, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';

function GoogleLogin() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    try {
      // Step 1: Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Step 2: Check if user already exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Step 3: Save new user to Firestore
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          greenScore: 0,
          createdAt: serverTimestamp(),
        });
        console.log('New user saved to Firestore:', user.uid);
      } else {
        console.log('Returning user:', user.uid);
      }

      // Step 4: Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error('Google Login Error:', err);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        id="google-login-btn"
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}
        sx={{
          borderColor: '#4285F4',
          color: '#4285F4',
          '&:hover': {
            backgroundColor: '#4285F410',
            borderColor: '#4285F4',
          },
          py: 1.2,
          fontWeight: 600,
        }}
      >
        Sign in with Google
      </Button>
    </Box>
  );
}

export default GoogleLogin;
