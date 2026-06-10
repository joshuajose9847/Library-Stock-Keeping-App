import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Welcome from '../Welcome/Welcome';
import './Login.css'
import {
  Box, TextField, Button, Typography, Container, Alert
} from '@mui/material';

const Login = ({ setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setCurrentUser(data.user);
        navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/home');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Server connection failed. Make sure backend is running.');
    }
  };

  return (
    <div className="login-container">
  <Container maxWidth="sm" className="login-card">
    
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" variant="contained" fullWidth>
          Login
        </Button>
           
      </Box>

     <Typography sx={{ mt: 2 }} className="signup-text">
  <Link to="/signup">Not a Registered User? Sign up</Link>
</Typography>
    </Container>
    </div>
  );
};

export default Login;
