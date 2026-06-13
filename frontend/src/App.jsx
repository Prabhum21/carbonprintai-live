import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Box, CircularProgress } from '@mui/material';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Calculator = React.lazy(() => import('./pages/Calculator'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AIAdvisor = React.lazy(() => import('./pages/AIAdvisor'));
const Challenges = React.lazy(() => import('./pages/Challenges'));

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/advisor" element={<AIAdvisor />} />
              <Route path="/challenges" element={<Challenges />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
