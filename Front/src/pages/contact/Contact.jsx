import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './Contact.module.css';

// Se crea esta función, para renderizar la página de contacto de la aplicación. 
const Contact = () => {
  // / Aqui se define el estado inicial del formulario, con los campos requeridos,
  //  se inicializa con un objeto vacío, se usa useState para manejar el estado
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    company: '',
    phone: '',
    message: '', // Campo de mensaje
  });

  // Creamos esta función para manejar los cambios en los campos del formulario y actualizar el estado, 
  // cada vez que el usuario ingrese información
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Creamos esta función para manejar el envío del formulario al backend, con los datos ingresados por el usuario.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://project-entregaya-final.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Tu mensaje ha sido enviado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });

        // Reinicia el formulario después del envío exitoso
        setFormData({
          name: '',
          email: '',
          city: '',
          company: '',
          phone: '',
          message: '', // Reinicia el campo de mensaje
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al enviar tu mensaje. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al enviar tu mensaje. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2>Líneas de Atención</h2>
        <hr className={styles.line} />
        <div className={styles.contactItem}>
          <i className="fa fa-phone"></i>
          <span className={styles.contactLabel}>Línea Telefónica</span>
          <span className={styles.contactText}>601 8889214</span>
        </div>
        <div className={styles.contactItem}>
          <i className="fa fa-whatsapp"></i>
          <span className={styles.contactLabel}>Línea WhatsApp</span>
          <span className={styles.contactText}>3153993910</span>
        </div>
      </div>

      <div className={styles.right}>
        <h3>Escríbenos tu inquietud</h3>
        <hr className={styles.line} />
{/*          Se crea el formulario 
 */}        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Nombre Completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="phone">Teléfono</label>
              <input
                type="phone"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="city">Ciudad</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="company">Empresa (Opcional)</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className={styles.textarea} 
              ></textarea>
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
