// ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedEmail = localStorage.getItem('email'); // 👈 dagdag check

    // kailangan may token at email
    if (!token || !storedEmail) {
      return setIsAuthorized(false);
    }

    if (allowedRoles.length === 0 || allowedRoles.includes(storedRole)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized('unauthorized');
    }
  }, [allowedRoles]);


  if (isAuthorized === null) return <div>Loading...</div>;
  if (isAuthorized === true) return children;
  if (isAuthorized === 'unauthorized') return <Navigate to="/unauthorized" />;

  return <Navigate to="/" />;
};

export default ProtectedRoute;
