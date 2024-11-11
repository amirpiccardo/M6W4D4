import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("token"); // Verifica la presenza del token

  if (!isAuthenticated) {
    // Se non è autenticato, redirige alla pagina di login
    return <Navigate to="/login" />;
  }

  return <Outlet />; // Se è autenticato, consente di visualizzare il contenuto
};

export default PrivateRoute;
