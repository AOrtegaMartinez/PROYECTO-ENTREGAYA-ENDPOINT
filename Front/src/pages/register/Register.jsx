import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.css'; // Impotamos los estilos
import Swal from 'sweetalert2'; // Importamos la librería de alertas
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importamos los íconos de ojo

const Register = () => {
  // Estados para controlar los valores de los inputs del formulario,
  // y para controlar la visibilidad de las contraseñas
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [ID_number, setID_number] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  // Estado para controlar la visibilidad de la contraseña (oculta por defecto)
  const [showPassword, setShowPassword] = useState(false); 
  // Estado para controlar la visibilidad de la confirmación de contraseña (oculta por defecto)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  // Hook para redireccionar a otra página
  const navigate = useNavigate();

  // Función para enviar los datos del formulario al servidor,
  // y mostrar una alerta dependiendo de la respuesta,
  // además de redireccionar al usuario a la página de login,
  // en caso de que el registro sea exitoso,
  // o mostrar un mensaje de error en caso contrario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se valida que las contraseñas coincidan
    if (password === confirmPassword) {
      const userData = {
        name,
        lastname,
        ID_number,
        email,
        password,
        phone,
      };

      try {
        // Se envían los datos al servidor, 
        const response = await fetch('https://project-entregaya.onrender.com/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        // Y se muestra una alerta dependiendo de la respuesta
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Registro Exitoso',
            text: '¡Te has registrado correctamente!',
          });
          navigate('/login');
        } else {
          const error = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Hubo un problema al registrar al usuario.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo conectar al servidor. Por favor, intenta de nuevo más tarde.',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
    }
  };

  // Función para redireccionar al usuario a la página de login
  const handleLoginRedirect = () => {
   window.location.hash = '#/login'
  };

  return (
    // Se crea el formulario de registro, con los campos necesarios,
    // y se le asignan los valores de los estados correspondientes,
    // además de asignarles funciones para actualizar dichos estados,
    // y se asigna la función para enviar los datos al servidor al evento onSubmit del formulario
    // También se asigna la función para redireccionar al usuario a la página de login al evento onClick del link
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <h2 className={styles.title}>Regístrate</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="name"
              value={name} // Asignamos el valor del estado, para que el input sea controlado
              onChange={(e) => setName(e.target.value)} // Se actualiza el estado con el valor del input introducido por el usuario
              required // Se establece que el campo es obligatorio
              placeholder="Introduce tu nombre"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="lastname"
              value={lastname} // Asignamos el valor del estado, para que el input sea controlado
              onChange={(e) => setLastname(e.target.value)} // Se actualiza el estado con el valor del input introducido por el usuario
              required // Se establece que el campo es obligatorio
              placeholder="Introduce tu apellido"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="ID_number"
              value={ID_number} // Asignamos el valor del estado, para que el input sea controlado
              onChange={(e) => setID_number(e.target.value)} // Se actualiza el estado con el valor del input introducido por el usuario
              required // Se establece que el campo es obligatorio
              placeholder="Introduce tu número de identificación"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="phone"
              value={phone} // Asignamos el valor del estado, para que el input sea controlado
              onChange={(e) => setPhone(e.target.value)} // Se actualiza el estado con el valor del input introducido por el usuario
              required // Se establece que el campo es obligatorio
              placeholder="Introduce tu teléfono"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="email"
              id="email"
              value={email} // Asignamos el valor del estado, para que el input sea controlado
              onChange={(e) => setEmail(e.target.value)} // Se actualiza el estado con el valor del input introducido por el usuario
              required // Se establece que el campo es obligatorio
              placeholder="Introduce tu correo electrónico"
            />
          </div>

          
          <div className={`${styles.inputGroup} ${styles.passwordContainer}`}>
            <input
            // Se establece el tipo de input según el estado showPassword,
            // si es true, se muestra el texto, si es false, se muestra un password
            // Se asigna el valor del estado password al input
              type={showPassword ? 'text' : 'password'} 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Introduce tu contraseña"
            />
            <span
            // Al hacer click en el ícono, se cambia el estado showPassword
            // para mostrar u ocultar la contraseña
              onClick={() => setShowPassword(!showPassword)} 
              className={styles.eyeIcon}
            >
{/*                Se muestra el ícono de ojo si showPassword es true, y el ícono de ojo tachado si es false
 */}              {showPassword ? <FaEye /> : <FaEyeSlash />} 
            </span>
          </div>

          <div className={`${styles.inputGroup} ${styles.passwordContainer}`}>
            <input
            // Se establece el tipo de input según el estado showConfirmPassword,
            // si es true, se muestra el texto, si es false, se muestra un password
              type={showConfirmPassword ? 'text' : 'password'} 
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirma tu contraseña"
            />
            <span
            // Al hacer click en el ícono, se cambia el estado showConfirmPassword
            // para mostrar u ocultar la contraseña
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              className={styles.eyeIcon}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />} 
            </span>
          </div>
          
          {/* Se crea el botón para enviar el formulario */}
          <button type="submit" className={styles.registerButton}>
            Registrarse
          </button>

          <p className={styles.loginLink}>
{/*           Se crea un link para redireccionar al usuario a la página de login
 */}            ¿Ya tienes cuenta? <Link to='/login' className={styles.loginLink}>Inicia sesión aquí </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
