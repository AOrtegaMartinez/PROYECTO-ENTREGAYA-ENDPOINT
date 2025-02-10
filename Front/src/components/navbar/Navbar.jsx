import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css"; // Importamos el archivo de estilos CSS Modules
import logo from "../../assets/images/logo.png"; // Importamos la imagen del logo

const Navbar = () => {
  // se crean los estados, que es uno de los conceptos más importantes en React. Los estados son variables 
  // que almacenan información y que pueden cambiar a lo largo del tiempo.
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Se crea un estado para manejar el menú desplegable
  const [user, setUser] = useState(null); // Se crea un estado para almacenar los datos del cliente
  const [loading, setLoading] = useState(true); // Se crea un estado de carga
  const [error, setError] = useState(null); // Se crea un estado de error
  const token = localStorage.getItem("token"); // Aquí Obtenemos el token desde localStorage

  // usamos el hook useEffect para verificar si hay un token en localStorage y si es así, obtener los datos del cliente desde la API
  useEffect(() => {
    if (!token) {
      setLoading(false); // Si no hay token, terminamos de cargar
      return; // Si no hay token, no hacemos nada
    }

    // Creamos una función asíncrona para obtener los datos del cliente, que se ejecutará al cargar el componente,
    //  y que se encargará de hacer la petición a la API, obtener los datos del cliente y guardarlos en el estado
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("https://project-entregaya-final.onrender.com/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          // Si el token es inválido o expirado
          localStorage.removeItem("token"); // Elimina el token
          setUser(null); // Limpia el estado del usuario
          window.location.href = "/login"; // Redirige al login
          return;
        }

        if (!response.ok) {
          throw new Error("Error al obtener los datos del cliente");
        }

        const data = await response.json(); // Aquí obtenemos los datos del cliente y los convertimos a JSON,
        //  usando el método json() del objeto response
        setUser(data); // Aqui guardamos los datos del cliente en el estado, usando el método setUser
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Aquí usamos condicionales para mostrar mensajes de carga y error, mientras se obtienen los datos del cliente, o si ocurrió algún problema
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  //Se crea una función para cerrar sesión, que elimina el token y redirige al login
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null); // Limpiamos el estado del cliente
    window.location.href = "/login"; // Redirige a la página de login después de cerrar sesión
  };

  return (
    <nav className={styles.navbar}>
      {/*       Aqui se renderiza el logo de la empresa
       */}{" "}
      <div className={styles.navbarLogo}>
        {/*   Al darle click al logo, redirige a la página de inicio
         */}{" "}
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      {/* Aquí se renderizan los enlaces de navegación, cada uno con su ruta correspondiente
       */}{" "}
      <div className={styles.navbarLinks}>
        <Link to="/trackorder" className={styles.navbarLink}>
          Rastrear
        </Link>
        <Link to="/sendpackage" className={styles.navbarLink}>
          Enviar
        </Link>
        <Link to="/about" className={styles.navbarLink}>
          Nosotros
        </Link>
        <Link to="/contact" className={styles.navbarLink}>
          Contáctanos
        </Link>
      </div>
      {/* Aquí se renderiza el botón de ingreso, o el nombre del usuario si ya ha iniciado sesión, y un menú desplegable con opciones de perfil y cerrar sesión
       */}{" "}
      {user ? (
        <div className={styles.userGreeting}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={styles.userGreetingButton}
          >
            Hola, {user.name} <span>&#9660;</span>
          </button>
          {isMenuOpen && (
            <div className={styles.dropdownMenu}>
              <Link to="/profile" className={styles.logoutLink}>
                Mi Perfil
              </Link>
              <Link
                to="/login"
                className={styles.logoutLink}
                onClick={handleLogout}
              >
                Cerrar sesión
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Link to="/login">
            <button className={styles.navbarButton}>Ingresar</button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
