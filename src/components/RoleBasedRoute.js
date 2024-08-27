import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RoleBasedRoute = ({ isAuthenticated, allowedRoles, userRole }) => {
  return isAuthenticated && allowedRoles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default RoleBasedRoute;
