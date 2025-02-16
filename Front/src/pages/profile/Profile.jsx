import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css'; // Se importan los estilos
import Swal from 'sweetalert2'; // Se importa la libreria Sweetalert, para mostrar alertas interactivas

const Profile = () => {
  // Se crean estados para manejar los datos del usuario, órdenes y estados de carga, que se usarán en el componente
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Se crean estados para controlar la edición y cancelación de órdenes
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  // Se obtiene el token de autenticación almacenado en localStorage
  const token = localStorage.getItem('token');

  // Se crea esta función asíncrona para obtener el perfil del usuario desde la API, y guardar los datos en el estado, 
  // para mostrarlos en el componente, y llenar los campos del formulario de modificación de perfil
  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://project-entregaya.onrender.com/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los datos del cliente');
      }
  
      const data = await response.json();
      setUser(data);
      setFormValues({
        name: data?.name,
        lastname: data?.lastname,
        ID_number: data?.ID_number,
        email: data?.email,
        phone: data?.phone,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Asegúrate de que la carga termine aquí
    }
  };
  

// Se crea esta función para obtener el historial de órdenes del usuario desde la API, donde se guardan las órdenes en el estado
const fetchOrderHistory = async () => {
  try {
    const response = await fetch('https://project-entregaya.onrender.com/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Error al obtener el historial de órdenes');
    }

    const data = await response.json();
    
    // Ordenar las órdenes por ID en orden ascendente
    const sortedOrders = data.sort((a, b) => a.order_id - b.order_id);
    
    setOrders(sortedOrders);
  } catch (err) {
    setError(err.message);
    console.error('Error fetching order history:', err);
  } finally {
    setLoading(false);
  }
};



useEffect(() => {
  if (!token) {
    window.location.href = '/login';
    return;
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      await fetchUserProfile();
      await fetchOrderHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [token]);

  // Se crea esta función, para manejar la modificación de una orden, donde se obtiene la orden seleccionada y se muestra el modal de modificación y se llenan los campos con los datos actuales de la orden
  const handleModifyOrder = (orderId) => {
    const order = orders.find((o) => o.order_id === orderId);
  
    if (order.current_status === 'In transit') {
      Swal.fire({
        icon: 'warning',
        title: 'No puedes modificar esta orden',
        text: 'La orden ya está en tránsito y no se puede modificar.',
        confirmButtonText: 'Entendido'
      });
      return;
    }
  
    Swal.fire({
      title: 'Modificar Orden',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px; text-align: left; padding-right: 15px;">
          <div style="display: flex; flex-direction: column;">
            <label style="font-weight: bold; margin-bottom: 0;">📦 Tipo de paquete:</label>
            <select id="package_type" class="swal2-input" style="width: calc(100% - 20px); padding: 8px 8px; margin-left:40px; margin-right: 10px; margin-top: 0; border-radius: 4px; border: 1px solid #ccc; background: white;">
              <option value="paquetes" ${order.package_type === "paquetes" ? "selected" : ""}>Paquetes</option>
              <option value="documentos" ${order.package_type === "documentos" ? "selected" : ""}>Documentos</option>
            </select>
          </div>
  
          <div style="display: flex; flex-direction: column;">
            <label style="font-weight: bold; margin-bottom: 0;">🏢 Departamento:</label>
            <input id="destination_department" class="swal2-input" style="width: calc(100% - 20px); padding: 6px 8px; margin-right: 10px; margin-top: 0;" value="${order.destination_department}">
          </div>
  
          <div style="display: flex; flex-direction: column;">
            <label style="font-weight: bold; margin-bottom: 0;">🌆 Municipio:</label>
            <input id="destination_municipality" class="swal2-input" style="width: calc(100% - 20px); padding: 6px 8px; margin-right: 10px; margin-top: 0;" value="${order.destination_municipality}">
          </div>
  
          <div style="display: flex; flex-direction: column;">
            <label style="font-weight: bold; margin-bottom: 0;">👤 Nombre del destinatario:</label>
            <input id="recipient_name" class="swal2-input" style="width: calc(100% - 20px); padding: 6px 8px; margin-right: 10px; margin-top: 0;" value="${order.recipient_name}">
          </div>
  
          <div style="display: flex; flex-direction: column;">
            <label style="font-weight: bold; margin-bottom: 0;">📍 Dirección de entrega:</label>
            <input id="destination_address" class="swal2-input" style="width: calc(100% - 20px); padding: 6px 8px; margin-right: 10px; margin-top: 0;" value="${order.destination_address}">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          package_type: document.getElementById('package_type').value,
          destination_department: document.getElementById('destination_department').value,
          destination_municipality: document.getElementById('destination_municipality').value,
          recipient_name: document.getElementById('recipient_name').value,
          destination_address: document.getElementById('destination_address').value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleSaveChanges(order.order_id, result.value);
      }
    });
  };
  
  
  
  
  // Se crea esta función, para manejar la cancelación de una orden, donde se obtiene la orden seleccionada y se muestra el modal de confirmación de cancelación y se guarda la orden a cancelar
  const handleCancelOrder = (orderId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await confirmCancel(orderId);
      }
    });
  };

 // Se crea esta función para confirmar la cancelación de una orden, donde se envía una petición PUT a la API para cambiar el estado de la orden a 'Canceled'
 const confirmCancel = async (orderId) => {
  try {
    const response = await fetch(`https://project-entregaya.onrender.com/api/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('No se pudo cancelar la orden');

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.order_id === orderId ? { ...order, current_status: 'Canceled' } : order
      )
    );

    Swal.fire('Orden cancelada', 'Se canceló con éxito', 'success');
  } catch (err) {
    Swal.fire('Error', err.message, 'error');
  }
};

  // Se crea esta función, para cerrar el modal de confirmación de cancelación
  const closeCancelConfirmation = () => {
    setShowCancelConfirmation(false);
  };

  // Se crea esta función, para guardar los cambios realizados en una orden, donde se envía una petición PUT a la API con los nuevos datos de la orden
  const handleSaveChanges = async (orderId, updatedValues) => {
    try {
      const response = await fetch(`https://project-entregaya.onrender.com/api/orders/${orderId}/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedValues),
      });
  
      if (!response.ok) throw new Error('No se pudo modificar la orden');
  
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, ...updatedValues } : order
        )
      );
  
      Swal.fire('Orden modificada', 'Los cambios se guardaron con éxito', 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const hasProfileChanges = () => {
    return (
      formValues.name !== user?.name ||
      formValues.lastname !== user?.lastname ||
      formValues.ID_number !== user?.ID_number ||
      formValues.email !== user?.email ||
      formValues.phone !== user?.phone
    );
  };
  
  const handleSaveProfileChanges = async () => {
    if (!hasProfileChanges()) {
      Swal.fire({
        icon: 'info',
        title: 'No realizaste ningún cambio',
        text: 'Por favor, realiza cambios antes de guardar.',
        showConfirmButton: true,
      });
      return;
    }
  
    try {
      const response = await fetch('https://project-entregaya.onrender.com/api/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
  
      if (!response.ok) {
        throw new Error('No se pudo actualizar el perfil');
      }
  
      fetchUserProfile(); // Re-fetch updated user profile
      setEditProfile(false);
  
      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado con éxito',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar el perfil',
        text: err.message,
        showConfirmButton: true,
      });
    }
  };

  // Aquí en esta función, se manejan los cambios en los campos del formulario de modificación de orden
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Aquí en esta función, se cierra el modal de modificación de orden
  const closeModifyModal = () => {
    setShowModifyModal(false);
    setSelectedOrder(null);
  };

  const toggleEditProfile = () => {
    setEditProfile(!editProfile);
  };

  // Se usa esta condición para mostrar un mensaje de carga, un mensaje de error o la información del perfil y las órdenes del usuario
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.leftColumn}>
      {/* Aquí se renderiza el perfil del usuario */}
        <h2 className={styles.title}>Mi Perfil</h2>
        <div className={styles.profileInfo}>
          <div className={styles.profileRow}>
            <span className={styles.label}>Nombre</span>
            {editProfile ? (
              <input
                className={styles.input}
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
              />
            ) : (
              <span className={styles.value}>{user?.name}</span>
            )}
          </div>
          <div className={styles.profileRow}>
            <span className={styles.label}>Apellido</span>
            {editProfile ? (
              <input
                className={styles.input}
                type="text"
                name="lastname"
                value={formValues.lastname}
                onChange={handleInputChange}
              />
            ) : (
              <span className={styles.value}>{user?.lastname}</span>
            )}
          </div>
          <div className={styles.profileRow}>
            <span className={styles.label}>No. Identificación</span>
            {editProfile ? (
              <input
                className={styles.input}
                type="text"
                name="ID_number"
                value={formValues.ID_number}
                onChange={handleInputChange}
              />
            ) : (
              <span className={styles.value}>{user?.ID_number}</span>
            )}
          </div>
          <div className={styles.profileRow}>
            <span className={styles.label}>Correo</span>
            {editProfile ? (
              <input
                className={styles.input}
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
              />
            ) : (
              <span className={styles.value}>{user?.email}</span>
            )}
          </div>
          <div className={styles.profileRow}>
            <span className={styles.label}>Teléfono</span>
            {editProfile ? (
              <input
                className={styles.input}
                type="tel"
                name="phone"
                value={formValues.phone}
                onChange={handleInputChange}
              />
            ) : (
              <span className={styles.value}>{user?.phone}</span>
            )}
          </div>

          {editProfile ? (
        <button
          className={styles.saveButton}
          onClick={handleSaveProfileChanges}
          disabled={!hasProfileChanges()} 
        >
          Guardar Cambios
        </button>
      ) : (
        <button className={styles.editButton} onClick={toggleEditProfile}>
          Editar
        </button>
      )}
    </div>
  </div>


  <div className={styles.rightColumn}>
      {/* Aquí se renderiza el historial de órdenes del usuario */}
      <h2 className={styles.title}>Historial de Órdenes</h2>
      {Array.isArray(orders) && orders.length > 0 ? (
        // Se crea una tabla para mostrar las órdenes del usuario
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th># Orden</th>
              <th>Estado</th>
              <th>Fecha de Creación</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* Se mapean las órdenes para mostrarlas en la tabla */}
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.current_status}</td>
                <td>{new Date(order.creation_date).toLocaleDateString()}</td>
                <td>
{/* Se muestran los botones para modificar y cancelar órdenes */}
<button
  onClick={() => {
    if (order.current_status === 'Canceled') return; // No hace nada si está cancelada

    if (order.current_status !== 'Pending') {
      Swal.fire({
        icon: 'warning',
        title: 'Acción no permitida',
        text: 'Está orden no puede ser modificada, ya esta en tránsito.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    handleModifyOrder(order.order_id);
  }}
  className={`${styles.modifyButton} ${order.current_status === 'Canceled' ? styles.disabledButton : ''}`}
  disabled={order.current_status === 'Canceled'}
>
  Modificar
</button>

<button
  onClick={() => {
    if (order.current_status === 'Canceled') return; // No hace nada si está cancelada

    if (order.current_status !== 'Pending') {
      Swal.fire({
        icon: 'warning',
        title: 'Acción no permitida',
        text: 'Está orden no puede ser cancelada, ya está en tránsito.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    handleCancelOrder(order.order_id);
  }}
  className={`${styles.cancelButton} ${order.current_status === 'Canceled' ? styles.disabledButton : ''}`}
  disabled={order.current_status === 'Canceled'}
>
  Cancelar
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.noOrdersMessage}>No tienes órdenes.</div> // Solo se muestra este mensaje si no hay órdenes.
      )}
    </div>

    {/* Se abre el modal para cancelar una orden */}
    {showCancelConfirmation && (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2>¿Estás seguro de que deseas cancelar esta orden?</h2>
          <div className={styles.modalButtons}>
            <button onClick={confirmCancel} className={styles.confirmButton}>
              Sí
            </button>
            <button onClick={closeCancelConfirmation} className={styles.cancelButton}>
              No
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Se abre el modal para modificar una orden */}
    {showModifyModal && (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2>Modificar Orden</h2>
          <form>
            <label>
              Tipo de Paquete
              <input
                type="text"
                name="package_type"
                value={formValues.package_type}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Departamento de Destino
              <input
                type="text"
                name="destination_department"
                value={formValues.destination_department}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Municipio de Destino
              <input
                type="text"
                name="destination_municipality"
                value={formValues.destination_municipality}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Nombre del Destinatario
              <input
                type="text"
                name="recipient_name"
                value={formValues.recipient_name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Dirección de Destino
              <input
                type="text"
                name="destination_address"
                value={formValues.destination_address}
                onChange={handleInputChange}
              />
            </label>
          </form>
          <div className={styles.modalButtons}>
            <button onClick={handleSaveChanges} className={styles.confirmButton}>
              Guardar Cambios
            </button>
            <button onClick={closeModifyModal} className={styles.cancelButton}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default Profile;