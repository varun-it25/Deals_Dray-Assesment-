import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cookies from 'react-cookies';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = () => {
      const token = cookies.load('user_token');
      if (!token) {
        setError('No authentication token found');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          setError('Your session has expired. Please log in again.');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setError(null);
        }
      } catch (err) {
        setError('Invalid authentication token');
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const logout = () => {
    cookies.remove('user_token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return { isAuthenticated, isLoading, error, logout };
};

export default useAuth;