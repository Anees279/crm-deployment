
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ClientData } from './layout/account';
import { Lead } from './layout/lead';
import { Contact } from './layout/contact';
import { Services } from './layout/services';
import HomePage from './layout/home';
import { Call } from './layout/call';
import { Meeting } from './layout/meeting';
import { NavBar } from './components/nav';
import { AuthForm } from './components/LoginForm';
import { SignUpForm } from './components/SignUpForm';
import  AdminPanel  from "./layout/admindashboard";
import  ProfilePage from "./layout/ProfilePage";
import {SocialMedia} from "./layout/socialmedia";
import FacebookPosts from "./components/socialmediaManagement/facebookpages/zipicka";
import FileUpload from "./components/socialmediaManagement/facebookpages/zipickaupload";
interface AppRoutesProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  onLogin: (username: string, password: string) => void;
  handleLogout: () => void;
  isSignUp: boolean;
  setIsSignUp: (signUp: boolean) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  isAuthenticated,
  setIsAuthenticated,
  onLogin,
  handleLogout,
  isSignUp,
  setIsSignUp,
}) => {
  const location = useLocation(); // Get the location for redirect purposes

  return (
    <>
      {isAuthenticated && <NavBar handleLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/Profile" />
            ) : (
              <AuthForm
                onLogin={onLogin}
                isSignUp={isSignUp}
                setIsSignUp={setIsSignUp}
              />
            )
          }
        />
        <Route
          path="/Profile"
          element={isAuthenticated ? <ProfilePage  /> : <Navigate to="/" />}
        />
        <Route
          path="/contact"
          element={isAuthenticated ? <Contact /> : <Navigate to="/" state={{ from: location }} />}
        />
        <Route
          path="/services"
          element={isAuthenticated ? <Services /> : <Navigate to="/" state={{ from: location }} />}
        />
        <Route
          path="/account"
          element={isAuthenticated ? <ClientData editable={true} /> : <Navigate to="/" state={{ from: location }} />}
        />
        <Route
          path="/call"
          element={isAuthenticated ? <Call /> : <Navigate to="/" state={{ from: location }} />}
        />
        <Route
          path="/meeting"
          element={isAuthenticated ? <Meeting /> : <Navigate to="/" state={{ from: location }} />}
        />
        <Route
          path="/lead"
          element={isAuthenticated ? <Lead /> : <Navigate to="/" state={{ from: location }} />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? < AdminPanel/> : <Navigate to="/" state={{ from: location }} />}
        />
         <Route
          path="/HomePage"
          element={isAuthenticated ? <  HomePage/> : <Navigate to="/" state={{ from: location }} />}
        /><Route
        path="/socialmedia"
        element={isAuthenticated ? <  SocialMedia/> : <Navigate to="/" state={{ from: location }} />}
      />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpForm onSignUp={onLogin} setIsSignUp={setIsSignUp} />
            ) : (
              <Navigate to="/Profile" />
            )
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/Profile' : '/'} />}
        />
      </Routes>
    </>
  );
};
