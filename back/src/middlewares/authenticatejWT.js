const jwt = require('jsonwebtoken');

// Se crea esta función para autenticar un JWT,
// se extrae el token del header de la petición,
// se verifica si el token existe, si no existe se retorna un mensaje de error,
// si el token es válido se añade el usuario decodificado a la petición y se llama a la función next,
const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Auth Header:', authHeader); 

  const token = authHeader?.replace('Bearer ', '');
  console.log('Token extraído:', token); 

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado, token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    console.error('Error al verificar el token:', error); 
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = authenticateJWT;
