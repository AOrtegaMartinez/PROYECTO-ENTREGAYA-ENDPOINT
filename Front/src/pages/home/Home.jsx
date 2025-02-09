import React from 'react';
import Carousel from '../../components/carousel/Carousel'; // Se importa el componente Carousel
import ServicesSection from '../../components/servicesSection/ServicesSection'; // Se importa ServicesSection

// Se crea la Page Home, para renderizar la página de inicio de la aplicación.
const Home = () => {
  return (
    <div>
      {/* Se renderiza el Carrusel*/}
      <Carousel />

      {/* Se renderiza el componente ServicesSection */}
      <ServicesSection />
    </div>
  );
};

export default Home;
