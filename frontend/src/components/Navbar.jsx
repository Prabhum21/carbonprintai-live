import { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box,
  Avatar, Menu, MenuItem, Divider, IconButton, Tooltip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import GrassIcon from '@mui/icons-material/Grass';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    await signOut(auth);
    navigate('/');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/dashboard');
  };

  // Get initials from display name or email
  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() ?? '?';
  };

  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar component="nav" aria-label="Main Navigation">
        {/* Logo */}
        <GrassIcon sx={{ mr: 1.5 }} />
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ flexGrow: 1, cursor: 'pointer', letterSpacing: 0.5 }}
          onClick={() => navigate('/')}
        >
          CarbonWise AI
        </Typography>

        {/* Nav Links */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
          <Button color="inherit" component={Link} to="/calculator">Calculator</Button>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/advisor">AI Advisor</Button>
          <Button color="inherit" component={Link} to="/challenges">Challenges</Button>
        </Box>

        {/* Auth Section */}
        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              {/* Show name on medium+ screens */}
              <Typography
                variant="body2"
                sx={{ display: { xs: 'none', md: 'block' }, opacity: 0.9 }}
              >
                {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
              </Typography>

              {/* Avatar with dropdown menu */}
              <Tooltip title="Account options">
                <IconButton
                  id="user-avatar-btn"
                  aria-label="Account options"
                  aria-controls={menuOpen ? 'user-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={menuOpen ? 'true' : undefined}
                  onClick={handleMenuOpen}
                  sx={{ p: 0 }}
                >
                  {user.photoURL ? (
                    <Avatar
                      src={user.photoURL}
                      alt={user.displayName}
                      sx={{ width: 36, height: 36, border: '2px solid rgba(255,255,255,0.5)' }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 36, height: 36,
                        bgcolor: 'secondary.main',
                        fontSize: 14,
                        fontWeight: 'bold',
                        border: '2px solid rgba(255,255,255,0.5)'
                      }}
                    >
                      {getInitials()}
                    </Avatar>
                  )}
                </IconButton>
              </Tooltip>

              {/* Dropdown Menu */}
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ sx: { mt: 1, minWidth: 200 } }}
              >
                {/* User Info Header */}
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" fontWeight="bold" noWrap>
                    {user.displayName || 'User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem id="menu-dashboard" onClick={handleProfile}>
                  <DashboardIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
                  My Dashboard
                </MenuItem>
                <Divider />
                <MenuItem id="menu-logout" onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              id="login-nav-btn"
              color="inherit"
              variant="outlined"
              component={Link}
              to="/login"
              sx={{ borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white' } }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
