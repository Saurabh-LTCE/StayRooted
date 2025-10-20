import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowRoles }) {
  const [isAllowed, setIsAllowed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('sr_token');
    const role = localStorage.getItem('sr_role');
    if (!token) {
      setIsAllowed(false);
      setChecked(true);
      return;
    }
    if (Array.isArray(allowRoles) && allowRoles.length > 0) {
      setIsAllowed(allowRoles.includes(role));
    } else {
      setIsAllowed(true);
    }
    setChecked(true);
  }, [allowRoles]);

  if (!checked) return null;
  if (!isAllowed) {
    // redirect by role if logged in but wrong role
    const token = localStorage.getItem('sr_token');
    const role = localStorage.getItem('sr_role');
    if (!token) return <Navigate to="/login" replace />;
    if (role === 'host') return <Navigate to="/dashboard/host" replace />;
    if (role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/dashboard/traveler" replace />;
  }
  return children;
}

export default ProtectedRoute;


