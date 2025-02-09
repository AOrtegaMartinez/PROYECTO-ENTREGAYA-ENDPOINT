import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom"; // Importamos Link para manejar la navegación
import styles from "./Footer.module.css"; // Importamos el archivo de estilos CSS Modules
import logo from "../../assets/images/logo.png"; // Importamos la imagen del logo

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Aquí se renderiza el contenido del footer */}
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          {/* Aquí se renderiza el logo, una pequeña descripción y los iconos de redes sociales */}
          {/*           usamos la etiqueta img para renderizar el logo de la empresa
           */}{" "}
          <img
            src={logo}
            alt="Logo de la Empresa"
            className={styles.footerLogo}
          />
          <p className={styles.footerDescription}>
            Soluciones logísticas a medida para optimizar tus procesos de
            negocio.
          </p>
          <div className={styles.footerSocials}>
            {/*             Aquí usamos la etiqueta a para renderizar los iconos de redes sociales, y les asignamos la ruta a la que queremos que nos lleve
             */}{" "}
            <a
              href="https://facebook.com" // Aquí se asigna la ruta a la que queremos que nos lleve el enlace
              target="_blank" //
              rel="noopener noreferrer" // Este atributo es necesario para evitar problemas de seguridad
              className={styles.socialIcon} // Aquí asignamos una clase para darle estilos
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        <div className={styles.footerLinks}>
          {/*           Aquí se renderizan los enlaces rápidos a las distintas secciones de la página
           */}{" "}
          <h3 className={styles.footerLinksTitle}>Enlaces Rápidos</h3>
          <ul className={styles.footerLinksList}>
            <li>
{/* usamos link que es un componente de react-router-dom para manejar la navegación, y le asignamos la ruta a la que queremos que nos lleve cada enlace
 */}              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/sendPackage">Enviar</Link>
            </li>
            <li>
              <Link to="/about">Nosotros</Link>
            </li>
            <li>
              <Link to="/contact">Contacto</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerContact}>
          {/*            Aquí se renderiza la información de contacto
           */}{" "}
{/*            usamos la etiqueta p para renderizar la información de contacto, y le asignamos una clase para darle estilos
 */}          <h3 className={styles.footerContactTitle}>Contacto</h3>
          <p className={styles.footerContactItem}>Teléfono: +123 456 789</p>
          <p className={styles.footerContactItem}>Email: entregaya@gmail.com</p>
          <p className={styles.footerContactItem}>
            Dirección: Calle Lisbon 123, Bogotá, Colombia
          </p>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2024 EntregaYA. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
