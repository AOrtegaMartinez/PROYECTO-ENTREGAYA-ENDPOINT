import React from 'react';
import { Navigate } from 'react-router-dom';


// Se crea esta función para proteger rutas en la aplicación, 
// asegurándo que solo los usuarios autenticados puedan acceder a ellas.
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token'); // Verificamos si hay un token

  if (!token) {
    // Si no hay token, redirigimos a login
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderizamos el componente de la ruta protegida
  return element;
};

export default PrivateRoute;
