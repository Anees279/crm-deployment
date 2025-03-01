

// export default App;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Use useNavigate and useLocation
import { AppRoutes } from './appRutes'; // Your routes component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation(); // Track current location to determine where user was trying to go

  // Check for the token on page load or refresh
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/'); // Navigate to login page if no token found
    }
  }, [navigate]);

  const handleLogin = (username: string, password: string) => {
    setIsAuthenticated(true); // After login, set the user as authenticated
    localStorage.setItem('authToken', 'your-token-here'); // Store auth token
    localStorage.setItem('loggedInUser', username); // Store username
    const destination = location.state?.from || '/HomePage'; // Redirect to the stored route or HomePage
    navigate(destination); // Navigate to the intended route or HomePage
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // Log out the user
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedInUser');
    navigate('/'); // Redirect to login page
  };

  return (
    <AppRoutes
      isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}
      onLogin={handleLogin}
      handleLogout={handleLogout}
      isSignUp={isSignUp}
      setIsSignUp={setIsSignUp}
    />
  );
}

export default App;
