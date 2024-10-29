import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginApi, signupApi, tokenVerifyApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import toaster from '../components/Toast/Toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to check if the token is valid
  const verifyToken = async (token) => {
    try {
      await tokenVerifyApi(token); // Call the API to verify the token
      setIsAuthenticated(true);
    } catch (error) {
      toaster.error("Token verification failed:")
      console.error("Token verification failed:", error);
      logout(); // Logout if token verification fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      verifyToken(accessToken); // Verify token on initial load
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const credentials = { email, password };
      const data = await loginApi(credentials);
      localStorage.setItem('accessToken', data.access_token);
      setIsAuthenticated(true);
      navigate('/'); 
    } catch (error) {
      toaster.error(`Login Error: ${error}`)
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      await signupApi(userData);
      navigate('/signin');
    } catch (error) {
      toaster.error(`Signup Error: ${error}`)
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
