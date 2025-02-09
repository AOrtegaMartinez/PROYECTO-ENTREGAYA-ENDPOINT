import { FaTruck, FaBox, FaWarehouse, FaPlane } from 'react-icons/fa'; // Se importa la libreria react-icons
import styles from './ServicesSection.module.css'; // Se importan los estilos

// Se crea la función ServicesSection, 
// para renderizar la sección de servicios logísticos en nuestra aplicación web. 
const ServicesSection = () => {
  return (
    <div className={styles['services-section']}>
      <h2 className={styles['services-title']}>Conoce nuestros servicios logísticos</h2>
      <div className={styles['services-container']}>
        {/* Cuadro 1 */}
        <div className={styles['service-box']}>
          <FaTruck className={styles['service-icon']} />
          <h3>Soluciones para Empresas</h3>
          <p>Ofrecemos soluciones logísticas personalizadas para empresas de todos los tamaños, optimizando sus procesos de transporte y distribución.</p>
{/*           <a href="#">Ver más</a>
 */}        </div>
        {/* Cuadro 2 */}
        <div className={styles['service-box']}>
          <FaBox className={styles['service-icon']} />
          <h3>Envíos Internacionales</h3>
          <p>Gestionamos envíos internacionales con rapidez y eficiencia, asegurando que tu mercancía llegue a su destino en el tiempo estimado.</p>
{/*           <a href="#">Ver más</a>
 */}        </div>
        {/* Cuadro 3 */}
        <div className={styles['service-box']}>
          <FaWarehouse className={styles['service-icon']} />
          <h3>Almacenamiento y Distribución</h3>
          <p>Proporcionamos servicios de almacenamiento seguro y eficiente, con una red de distribución optimizada para entregar tus productos a tiempo.</p>
{/*           <a href="#">Ver más</a>
 */}        </div>
        {/* Cuadro 4 */}
        <div className={styles['service-box']}>
          <FaPlane className={styles['service-icon']} />
          <h3>Transporte Aéreo</h3>
          <p>Ofrecemos soluciones de transporte aéreo para tus productos, con opciones rápidas y confiables para envíos urgentes o de alto valor.</p>
{/*           <a href="#">Ver más</a>
 */}        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
