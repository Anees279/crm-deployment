
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Stack, Divider, Link } from '@mui/material';
import LottieAnimation from './lottiefiles'; // Import the Lottie animation
import { ToastContainer, toast } from 'react-toastify'; // For success/error notifications
import { useNavigate } from 'react-router-dom';

interface SignUpFormProps {
  onSignUp: (name: string, email: string, password: string) => void;
  setIsSignUp: (isSignUp: boolean) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUp, setIsSignUp }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate(); // For navigation after successful signup

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (!name || !email || !password) {
      toast.error('Name, email, and password are required!');
      return;
    }

    // Send the signup request to the backend
    try {
      const response = await fetch('https://crm-deployment-five.vercel.app/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        toast.success(message);
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after successful signup
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        toast.error(details || message);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error('Signup failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LottieAnimation /> {/* Lottie animation */}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#f0f8ff',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          margin="normal"
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Sign Up
        </Button>

        <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', marginTop: 2 }}>
          <Link href="#" variant="body2">
            Forgot password?
          </Link>
          <Link href="#" variant="body2" onClick={() => setIsSignUp(false)}>
            Already have an account? Login
          </Link>
        </Stack>

        <Divider sx={{ marginY: 2 }}>OR</Divider>

        <Stack spacing={2}>
          <Button variant="outlined" color="primary" fullWidth>
            Sign Up with Google
          </Button>
          <Button variant="outlined" color="primary" fullWidth>
            Sign Up with Apple
          </Button>
        </Stack>
      </Box>

      {/* Toast container for success/error notifications */}
      <ToastContainer />
    </Box>
  );
};
