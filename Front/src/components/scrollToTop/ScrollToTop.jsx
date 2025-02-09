import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Se crea esta función, para desplazar la ventana de visualización 
// al inicio de la página cada vez que cambia la ruta en la aplicación.
const ScrollToTop = () => {
  
  // Aquí, se obtiene la ruta actual de la aplicación utilizando 
  // el hook useLocation de react-router-dom
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Lleva al inicio de la página
  }, [pathname]); // Se ejecuta cada vez que cambia la ruta

  return null; 
};

export default ScrollToTop;
