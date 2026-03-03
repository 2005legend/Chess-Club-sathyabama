
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/auth/verify-token', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Strict Admin Check
          if (data.user.email === 'chessclub.sathyabama@gmail.com') {
            setIsAuthenticated(true);
          } else {
            // Valid token but not admin
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminAuthenticated');
            setIsAuthenticated(false);
          }
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminAuthenticated');
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
