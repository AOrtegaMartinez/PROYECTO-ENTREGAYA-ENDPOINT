const Client = require('../models/Client'); // Modelo de cliente
const Order = require('../models/Order'); // Modelo de orden
const OrderStatus = require('../models/OrderStatus'); // Modelo de estado de la orden

/* 
Esta función, obtiene el perfil del cliente usando req.user.id.
Busca al cliente en la base de datos y, si no lo encuentra, responde con error 404.
Obtiene el historial de órdenes del cliente, incluyendo el estado de cada orden (OrderStatus).
Devuelve los detalles del cliente y un resumen de las órdenes (ID, tipo de paquete, fecha, estado y dirección).
Si ocurre un error, responde con un mensaje y código de estado 500. 
*/
exports.getProfile = async (req, res) => {
  try {
    const clientId = req.user.id; 

    // Buscar al cliente por ID
    const client = await Client.findByPk(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Obtener el historial de órdenes del cliente
    const orders = await Order.findAll({
      where: { client_id: clientId }, // Filtramos las órdenes por el clientId
      include: [
        {
          model: OrderStatus,  // Incluir el estado de la orden
          as: 'status', // Alias utilizado en la relación (cambiado a 'status')
          attributes: ['name']  // Solo el nombre del estado
        }
      ]
    });

    // Responder con los datos del cliente y su historial de órdenes
    res.status(200).json({
      client_id: client.id,
      name: client.name,
      lastname: client.lastname,
      ID_number: client.ID_number,
      email: client.email,
      phone: client.phone,
      orders: orders.map(order => ({
        order_id: order.order_id,
        package_type: order.package_type,
        creation_date: order.creation_date,
        current_status: order.status.name, 
        destination_address: order.destination_address,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el perfil y el historial de órdenes' });
  }
};

// Se crea esta función para actualizar el perfil del cliente,
// se obtienen los datos por body,
// se busca al cliente usando el metódo findByPk,
// Sino se encuentra el cliente se arroja un mensaje de error,
// Si se encuentra el cliente, se actualizan los datos del mismo con los datos proporcionados por body,
// Se guardan los datos con el metodo Save,
// y se arroja un mensaje de exito.
exports.updateProfile = async (req, res) => {
  try {
    const clientId = req.user.id; // Usamos el ID del cliente del JWT
    const { name, lastname, ID_number, email, phone } = req.body;

    // Buscar al cliente por ID
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Actualizar los campos del cliente
    client.name = name || client.name;
    client.lastname = lastname || client.lastname;
    client.ID_number = ID_number || client.ID_number;
    client.email = email || client.email;
    client.phone = phone || client.phone;

    // Guardar los cambios
    await client.save();

    res.status(200).json({ message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};
