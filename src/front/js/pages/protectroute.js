// ProtectRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from '../../js/store/AuthContext';

export const ProtectRoute = ({ children, requiredRole }) => {
  const { user } = useContext(AuthContext);

  console.log(user); // Verifica si el usuario y el rol son correctos

  if (!user) {
    return <Navigate to="/admin" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};
