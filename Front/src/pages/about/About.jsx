import React from 'react';
import styles from './About.module.css'; // Se importan los estilos
import image from '../../assets/images/image_about_5.jpg'; // Se importa la imagen a usar

// Se crea esta función About, para renderizar la página "Acerca de" de la aplicación. 
const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.imageContainer}>
{/*         Se usa la eqtiqueta img, para mostrar la imagen, usando los atributos src y alt.
 */}          <img
            src={image}
            alt="Mensajería de EntregaYA"
            className={styles.serviceImage}
          />
        </div>
      <div className={styles.contentContainer}>
        <h2 className={styles.title}>Nuestra Empresa</h2>
        <p className={styles.description}>
          En EntregaYA, ofrecemos soluciones logísticas rápidas, seguras y confiables para el envío de paquetes físicos a nivel nacional e internacional. Nuestra misión es asegurar la entrega puntual y segura de cada paquete, garantizando una experiencia satisfactoria para todos nuestros clientes.
        </p>
        <h3 className={styles.subtitle}>Misión</h3>
        <p className={styles.text}>
          Nuestra misión es brindar a nuestros clientes un servicio de mensajería confiable y puntual, utilizando tecnología avanzada y un equipo comprometido con la satisfacción del cliente.
        </p>

        <h3 className={styles.subtitle}>Visión</h3>
        <p className={styles.text}>
          Ser la empresa líder en el sector de mensajería física, proporcionando soluciones innovadoras y eficientes que mejoren la experiencia logística de nuestros clientes.
        </p>
        <h3 className={styles.subtitle}>Por qué Elegir EntregaYA</h3>
        <p className={styles.text}>
          EntregaYA es la opción más confiable para tus envíos. Con un equipo altamente capacitado y un sistema de seguimiento en tiempo real, te garantizamos que tus paquetes llegarán a su destino de manera segura y puntual.
        </p>

      </div>
    </div>
  );
};

export default About;
