import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate para navegar entre las páginas
import Swal from "sweetalert2"; // Importamos SweetAlert2 para mostrar alertas en la aplicación
import styles from "./SendPackage.module.css"; // Importamos los estilos del componente

const SendPackage = () => {
  // Aqui se define el estado inicial del formulario, con los campos requeridos,
  //  se inicializa con un objeto vacío, se usa useState para manejar el estado
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    ID_number: "",
    department: "",
    municipality: "",
    address: "",
    phone: "",
    email: "",
    package_type: "",
    recipient_name: "",
    destination_address: "",
    destination_department: "",
    destination_municipality: "",
    client_id: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  // instanciamos este Hook useNavigate para navegar entre las páginas,
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // usamos useEffect para cargar los datos del usuario, cuando el componente se monta, se ejecuta esta función
  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      navigate("/login");
      return;
    }

    // Creamos esta función para obtener los datos del usuario, aquí hacemos la petición a la API
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No autorizado o sesión expirada");
        }

        const data = await response.json(); // Aqui convertimos la respuesta a un objeto JSON, para poder manipularla
        setFormData((prevState) => ({ // Aqui actualizamos el estado con la información del usuario, que se obtiene de la API
          ...prevState,
          name: data.name,
          lastname: data.lastname,
          ID_number: data.ID_number,
          phone: data.phone,
          email: data.email,
          client_id: data.client_id,
        }));
      } catch (error) {
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [token, navigate]);

  // Creamos esta función para manejar los cambios en los campos del formulario y actualizar el estado, 
  // cada vez que el usuario ingrese información
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Creamos esta función para manejar el envío del formulario al backend, con los datos ingresados por el usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    console.log("Enviando los datos del formulario:", formData);

    try {
      const response = await fetch("http://localhost:3000/api/orders", { // Aqui hacemos la petición al backend, al endpoint de la API
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        Swal.fire({
          title: "Instrucciones",
          html: `Para completar la transacción, por favor sigue estos pasos:<br />1. Código de transacción: ${data.orderCode}.<br />2. Dirígete a una de las oficinas de EntregaYa más cercanas dentro de las próximas 24 horas.<br />3. Lleva el paquete o documento que deseas enviar, junto con el código de transacción.<br />4. Realiza el pago en la oficina para completar el proceso.<br />Recuerda que si no realizas el pago dentro de las 24 horas, la transacción será cancelada.<br />¡Gracias por confiar en EntregaYa!`,
          icon: "success",
        }).then(() => {
          // Aqui limpiamos los campos del formulario, una vez que se envía la información, para mejorar la experiencia del usuario
          setFormData({
            department: "",
            municipality: "",
            address: "",
            package_type: "",
            recipient_name: "",
            destination_address: "",
            destination_department: "",
            destination_municipality: "",
            client_id: "",
          });
        });
      } else {
        throw new Error("Error al enviar el paquete");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar el paquete. Por favor, inténtalo de nuevo.",
        icon: "error",
      });
    }
  };

  if (!isAuthenticated) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.sendPackageContainer}>
      {/* Aqui se renderiza el formulario para enviar un paquete o documento, con los campos requeridos */}
      <div className={styles.sendPackageBox}>
        <h2 className={styles.title}>Envía tu paquete</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="name"
              value={formData.name} // Aqui se carga el nombre del usuario, que se obtiene de la API
              readOnly // con este atributo, nos aseguramos que el campo no se pueda modificar, esta información se carga desde la API
              placeholder="Nombre"
              required
            />
            <input
              type="text"
              name="lastname"
              value={formData.lastname} // Aqui se carga el apellido del usuario, que se obtiene de la API
              readOnly // con este atributo, nos aseguramos que el campo no se pueda modificar, esta información se carga desde la API
              placeholder="Apellido"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="ID_number"
              value={formData.ID_number} // Aqui se carga el número de identificación del usuario, que se obtiene de la API
              readOnly // con este atributo, nos aseguramos que el campo no se pueda modificar, esta información se carga desde la API
              placeholder="Número de Identificación"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="department"
              value={formData.department} // Aqui se carga el departamento del usuario, que se obtiene de la API
              onChange={handleChange} // Aqui el usuario puede modificar el campo, usamos esta función para actualizar el estado con la información ingresada
              placeholder="Departamento"
              required // con esto nos aseguramos que el usuario ingrese información en este campo
            />
            <input
              type="text"
              name="municipality"
              value={formData.municipality} // Aqui se carga el municipio del usuario, que se obtiene de la API
              onChange={handleChange} //  Aqui el usuario puede modificar el campo, usamos esta función para actualizar el estado con la información ingresada
              placeholder="Municipio"
              required // con esto nos aseguramos que el usuario ingrese información en este campo
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="address"
              value={formData.address} // Aqui se carga la dirección del usuario, que se obtiene de la API
              onChange={handleChange} //  Aqui el usuario puede modificar el campo, usamos esta función para actualizar el estado con la información ingresada
              placeholder="Dirección"
              required // con esto nos aseguramos que el usuario ingrese información en este campo
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone} // Aqui se carga el teléfono del usuario, que se obtiene de la API
              readOnly // con este atributo, nos aseguramos que el campo no se pueda modificar, esta información se carga desde la API
              placeholder="Teléfono"
              required
            />
            <input
              type="email" // usamos type email para que el navegador valide que el campo tenga un formato de correo electrónico
              name="email"
              value={formData.email} // Aqui se carga el correo electrónico del usuario, que se obtiene de la API
              readOnly // Con este atributo, nos aseguramos que el campo no se pueda modificar, esta información se carga desde la API
              placeholder="Correo Electrónico"
              required
            />
          </div>

          <h3 className={styles.subtitle}>Tipo de Producto</h3>
          <div className={styles.inputGroup}>
            <label>
              <input
                type="radio" // usamos type radio para que el usuario pueda seleccionar una opción
                name="package_type"
                value="documentos"
                checked={formData.package_type === "documentos"} // con esta propiedad, nos aseguramos de que el campo esté seleccionado
                onChange={handleChange} // Aqui el usuario puede modificar el campo, usamos esta función para actualizar el estado con la información ingresada
              />
              <span>Documentos</span>
            </label>
            <label>
              <input
                type="radio"
                name="package_type"
                value="paquetes"
                checked={formData.package_type === "paquetes"} // con esta propiedad, nos aseguramos de que el campo esté seleccionado
                onChange={handleChange} // Aqui el usuario puede modificar el campo, usamos esta función para actualizar el estado con la información ingresada
              />
              <span>Paquetes</span>
            </label>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="destination_department"
              value={formData.destination_department} // Aqui el usuario puede ingresar el departamento de destino
              onChange={handleChange} // con esta función actualizamos el estado con la información ingresada	por el usuario
              placeholder="Ingresa el Departamento Destino"
              required // con esto nos aseguramos que el usuario ingrese información en este campo
            />

            <input
              type="text"
              name="destination_municipality"
              value={formData.destination_municipality} // Aqui el usuario puede ingresar el municipio de destino
              onChange={handleChange} // con esta función actualizamos el estado con la información ingresada	por el usuario
              placeholder="Ingresa el Municipio Destino"
              required // con esto nos aseguramos que el usuario ingrese información en este campo
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="recipient_name"
              value={formData.recipient_name} // Aqui el usuario puede ingresar el nombre del destinatario
              onChange={handleChange} // con esta función actualizamos el estado con la información ingresada	por el usuario
              placeholder="Nombre del destinatario"
              required // con esto nos aseguramos que el usuario ingrese información en este campo
            />
            <input
              type="text"
              name="destination_address"
              value={formData.destination_address} // Aqui el usuario puede ingresar la dirección de destino
              onChange={handleChange} // con esta función actualizamos el estado con la información ingresada	por el usuario
              placeholder="Dirección de destino"
              required // con esto nos aseguramos que el usuario ingrese información en este campo
            />
          </div>

          <button type="submit" className={styles.sendButton}>
            {" "}
            {/* con este botón, el usuario envía la información del formulario */}
            Enviar Paquete
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendPackage;
