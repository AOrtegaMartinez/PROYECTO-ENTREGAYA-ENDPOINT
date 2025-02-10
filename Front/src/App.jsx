import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos los componentes y páginas necesarios
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import ScrollToTop from './components/scrollToTop/ScrollToTop'; 
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import About from './pages/about/About';
import Contact from './pages/contact/Contact';
import Register from './pages/register/Register';
import SendPackage from './pages/sendPackage/SendPackage';
import TrackOrder from './pages/trackOrder/TrackOrder';
import Profile from './pages/profile/Profile';
import PrivateRoute from './components/privateRoute/PrivateRoute'; 

const App = () => {
  return (
     // Se utiliza el componente Router para definir las rutas de la aplicación,
    // y el componente Routes para definir las rutas hijas.
    // Cada ruta se define con el componente Route, que recibe la prop path con la URL de la ruta,
    // y la prop element con el componente que se renderizará cuando la URL coincida con la ruta.
    <Router>
      <ScrollToTop /> {/* Aseguramos que la página se desplace hacia arriba */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas principales con Navbar y Footer */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route path="/trackOrder" element={<><Navbar /><TrackOrder /><Footer /></>} />
        <Route path="/sendPackage" element={<><Navbar /><SendPackage /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />

        {/* Ruta protegida para el perfil */}
        <Route path="/profile" element={<PrivateRoute element={<><Navbar /><Profile /><Footer /></>} />} />
      </Routes>
    </Router>
  );
};

export default App;
