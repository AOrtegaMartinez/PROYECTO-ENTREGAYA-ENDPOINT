import React, { useState } from 'react';
import { FaTruckMoving } from 'react-icons/fa'; // Ícono de rastreo
import Swal from 'sweetalert2'; // Importamos SweetAlert2
import styles from './TrackOrder.module.css';

// Se crea esta función TrackOrder, 
// para renderizar una página de rastreo de pedidos en la aplicación.
// Este componente permite a los usuarios ingresar un número de guía (UUID) 
// para rastrear el estado de su pedido.
const TrackOrder = () => {
  const [uuid, setUuid] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  // Función para rastrear el pedido
  const orderTracker = async (e) => {
    e.preventDefault();  // Evita el comportamiento por defecto del formulario
    try {
      const response = await fetch(`http://localhost:3000/api/orders/track/${uuid}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setError('');

        // Mostramos los detalles del pedido en un modal
        Swal.fire({
          title: 'Detalles del Envío',
          html: `
            <p><strong>Estado:</strong> ${data.current_status}</p>
            <p><strong>Destino:</strong> ${data.destination_address}</p>
          `,
          icon: 'info',
          confirmButtonText: 'Cerrar',
        });
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.message || 'Orden no encontrada'}`);
        setOrder(null);
      }
    } catch (error) {
      setError(`Error al buscar la orden: ${error.message}`);
      setOrder(null);
    }
  };

  return (
    <div className={styles.trackOrderContainer}>
      <div className={styles.content}>
        <FaTruckMoving className={styles.icon} />
        <h1 className={styles.title}>Rastrea tu pedido</h1>
        <form className={styles.form} onSubmit={orderTracker}>
          <input
            className={styles.input}
            type="text"
            placeholder="Introduce tu número de guía"
            value={uuid} 
            onChange={e => setUuid(e.target.value)} 
            required
          />
    <div className={styles.multiGuideMessage}>
  <span><strong>Ejemplo:</strong> a67b7f5e-1efa-4cfc-8329-52b8518b053a</span>
  <span className={styles.smallText}><strong>Sin espacios adicionales al inicio.</strong></span>
</div>

          <button type="submit" className={styles.button}>
            Rastrear
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default TrackOrder;
