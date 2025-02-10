import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; // Se importan los estilos
import Swal from 'sweetalert2'; // Se importa la librería de alertas
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  // Se crean los estados para el correo, contraseña y mostrar contraseña,
  //  y se inicializan en vacío y false,
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Se instancia el hook useNavigate para redireccionar a otras rutas,
  const navigate = useNavigate();

  // Se crea la función handleSubmit para enviar los datos del formulario al backend,
  //  y se envía una petición POST con los datos del formulario al endpoint de login,
  //  y se guarda el token en el local storage si la petición es exitosa,
  //  y se muestra un mensaje de error si la petición falla
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Se envía una petición POST al endpoint de login con los datos del formulario,
      const response = await fetch('https://project-entregaya.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      // Se obtiene la respuesta en formato JSON,
      const data = await response.json();

      // Si la respuesta es exitosa, se guarda el token en el local storage
      //  y se redirecciona a la ruta /profile,
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/profile');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: data.message || 'Correo electrónico o contraseña incorrectos.',
        });
      }
      // Si la petición falla, se muestra un mensaje de error,
    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema con la conexión. Intenta de nuevo más tarde.',
      });
    }
  };
  // Se crea la función handleRegisterRedirect para redireccionar a la ruta /register
  const handleRegisterRedirect = () => {
    window.location.hash = '#/register';
  };
  
  return (
    // Se crea el formulario de inicio de sesión con los campos de correo y contraseña
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              value={email} // Se asigna el valor del estado email al campo de correo
              onChange={(e) => setEmail(e.target.value)} // Se actualiza el estado email, conel valor que introduce el usuario
              required // Se establece que el campo es obligatorio
              placeholder="Introduce tu correo"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password} // Se asigna el valor del estado password al campo de contraseña
              onChange={(e) => setPassword(e.target.value)} // Se actualiza el estado password, con el valor que introduce el usuario
              required // Se establece que el campo es obligatorio
              placeholder="Introduce tu contraseña"
            />
            <span
            // Se crea un icono para mostrar u ocultar la contraseña
              className={styles.eyeIcon}
              // Se cambia el estado showPassword al hacer clic en el icono
              onClick={() => setShowPassword(!showPassword)}
            >
{/*             Se muestra el icono de ojo si showPassword es true, y el icono de ojo tachado si es false
 */}              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
{/*            Se crea un botón para enviar el formulario
 */}          <button type="submit" className={styles.loginButton}>Iniciar sesión</button>
        </form>
{/*          Se crea un enlace para redireccionar a la ruta /register, si el usuario no tiene cuenta
             Se usa onClick para llamar a la función handleRegisterRedirect al hacer clic en el enlace
 */}        <p className={styles.registerLink}>
  ¿No tienes cuenta? <button onClick={handleRegisterRedirect} className={styles.registerButton}>Regístrate aquí</button>
</p>
      </div>
    </div>
  );
};

export default Login;
