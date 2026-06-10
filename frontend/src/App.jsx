import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Calculator from './pages/Calculator';
import Dashboard from './pages/Dashboard';
import AIAdvisor from './pages/AIAdvisor';
import Challenges from './pages/Challenges';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/advisor" element={<AIAdvisor />} />
            <Route path="/challenges" element={<Challenges />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
