import React, { useContext } from "react"; // Asegúrate de importar React aquí
import { Navigate } from "react-router-dom";
import { AuthContext } from '../../js/store/AuthContext';

export const ProtectRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectRoute;
