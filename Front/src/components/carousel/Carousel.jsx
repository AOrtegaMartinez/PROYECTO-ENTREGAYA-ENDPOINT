import React, { useState, useEffect } from "react";
import styles from "./Carousel.module.css"; // Importamos los estilos del carrusel
import image1 from "../../assets/images/image_home_23.jpeg";
import image2 from "../../assets/images/image_home_24.webp";
import image3 from "../../assets/images/image_home_16.webp";

const Carousel = () => {
  // Se crea un estado para guardar el índice de la imagen actual
  const [currentIndex, setCurrentIndex] = useState(0);

  // Se crea un array con las imágenes que se mostrarán en el carrusel, estas imágenes se importan al principio del archivo
  const images = [image1, image2, image3];

  // Se crea a través de este useEffect un intervalo que cambia la imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval); // Aquí, se limpia el intervalo al desmontar el componente
  }, []);

  return (
    <div className={styles.carousel}>
{/*        Aquí, usamos el índice actual para mostrar la imagen correspondiente, y le añadimos una clase para darle estilos,  en este caso, la clase carouselImage
 */}      <img
        src={images[currentIndex]}
        alt={`Imagen ${currentIndex + 1}`}
        className={styles.carouselImage}
      />
    </div>
  );
};

export default Carousel;
