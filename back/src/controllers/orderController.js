const { Order, Client, OrderStatus } = require('../models/index');
const { v4: uuidv4, validate } = require('uuid');
const {sendConfirmationEmail} = require('../mailer'); 

/* 
Esta función se utiliza para crear una nueva orden.
Verifica primero si el cliente existe.
Luego, obtiene el estado 'Pending' (Pendiente) de la base de datos por defecto.
Después, crea la orden con los datos proporcionados y genera un código único para la orden.
Finalmente, se envía un correo de confirmación con el código de la orden al cliente y se responde con la orden creada. 
*/
const createOrder = async (req, res) => {
  const orderCode = uuidv4(); 
  const { name, lastname, ID_number, department, municipality, address, phone, email, 
          package_type, destination_department, destination_municipality, recipient_name,
           destination_address, client_id } = req.body;

  try {
    const client = await Client.findByPk(client_id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const validStatus = await OrderStatus.findOne({
      where: { name: 'Pending' }
    });

    if (!validStatus) {
      return res.status(400).json({ message: 'Estado "Pending" no encontrado' });
    }

    const newOrder = await Order.create({
      name,
      lastname,
      ID_number,
      department,
      municipality,
      address,
      phone,
      email,
      package_type,
      destination_department,
      destination_municipality,
      recipient_name,
      destination_address,
      client_id,
      current_status: validStatus.status_id, 
      orderCode,
    });
   
    sendConfirmationEmail(email, orderCode, req.body);

    return res.status(201).json({ message: 'Orden creada exitosamente', order: newOrder, orderCode });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear la orden', error });
  }
};

/* 
Esta función recupera todas las órdenes.
Cada orden incluye el nombre y correo del cliente, y el nombre del estado de la orden.
La respuesta contiene las órdenes en formato simplificado. 
*/
const getOrders = async (req, res) => {
  try {
    const clientId = req.user.id; // Suponiendo que req.user contiene la información del usuario autenticado

    const orders = await Order.findAll({
      where: { client_id: clientId }, // Filtrar por el usuario autenticado
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['name', 'email'],
        },
        {
          model: OrderStatus,
          as: 'status',
          attributes: ['name'],
        }
      ]
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No hay órdenes para este usuario' });
    }

    const simplifiedOrders = orders.map(order => ({
      order_id: order.order_id,
      name: order.name,
      lastname: order.lastname,
      ID_number: order.ID_number,
      department: order.department,
      municipality: order.municipality,
      address: order.address,
      phone: order.phone,
      email: order.email,
      package_type: order.package_type,
      destination_department: order.destination_department,
      destination_municipality: order.destination_municipality,
      recipient_name: order.recipient_name,
      destination_address: order.destination_address,
      creation_date: order.creation_date,
      current_status: order.status ? order.status.name : 'No definido',
      client: {
        name: order.client.name,
        email: order.client.email
      }
    }));

    return res.status(200).json(simplifiedOrders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener las órdenes', error });
  }
};


/* 
Esta función recupera una orden específica por su ID.
Incluye los datos del cliente relacionados con la orden, como nombre y correo, además del estado de la orden. 
*/
const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: OrderStatus,
          as: 'status',
          attributes: ['name'],
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener la orden', error });
  }
};

/* 
Esta función, permite actualizar el estado de una orden (por ejemplo, cambiar de 'Pending' a 'Delivered').
Verifica que el estado proporcionado sea válido y que la orden no haya sido entregada o cancelada previamente.
Solo permite cambiar a "Canceled" si la orden está en un estado modificable como "Pending". 
*/
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { current_status } = req.body;

  try {
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    if (order.current_status === 4) { 
      return res.status(400).json({ message: 'La orden ya ha sido entregada y no se puede modificar' });
    }
    if (order.current_status === 5) { 
      return res.status(400).json({ message: 'La orden ya está cancelada' });
    }

    if (current_status === 'Canceled' && (order.current_status !== 2 && order.current_status !== 3)) {
      return res.status(400).json({ message: 'No se puede cancelar una orden en este estado' });
    }

    const status = await OrderStatus.findOne({ where: { name: current_status } });
    if (!status) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    order.current_status = status.status_id;
    await order.save();

    return res.status(200).json({ message: 'Estado de la orden actualizado', order });
  } catch (error) {
    console.error(error);
  }
};

/* 
Esta Cancela una orden específica por su ID.
Verifica si la orden ya fue entregada o cancelada.
Si la orden está en un estado que permite la cancelación, se actualiza a "Canceled" y se guarda. 
*/
const cancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    if (order.current_status === 4) { 
      return res.status(400).json({ message: 'La orden ya ha sido entregada y no puede ser cancelada' });
    }
    if (order.current_status === 5) { 
      return res.status(400).json({ message: 'La orden ya está cancelada' });
    }

    const canceledStatus = await OrderStatus.findOne({ where: { name: 'Canceled' } });
    if (!canceledStatus) {
      return res.status(400).json({ message: 'Estado cancelado no encontrado' });
    }

    order.current_status = canceledStatus.status_id;
    await order.save();

    return res.status(200).json({ message: 'Orden cancelada exitosamente', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al cancelar la orden', error });
  }
};

/* 
Permite actualizar ciertos campos de una orden (como tipo de paquete, dirección de destino, etc.).
Verifica que la orden esté en estado 'Pending' antes de actualizarla.
Solo se actualizan los campos permitidos.
Si no se proporcionan campos válidos o la orden no está en estado 'Pending', no se realiza la actualización. 
*/
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body; 

  const allowedFields = ['package_type', 'destination_department', 'destination_municipality', 'recipient_name', 'destination_address'];

  const filteredData = {};
  for (const key in updatedData) {
    if (allowedFields.includes(key)) {
      filteredData[key] = updatedData[key];
    }
  }

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    if (order.current_status !== 2) {
      return res.status(400).json({
        message: 'Solo se puede modificar una orden en estado "pending"',
      });
    }

    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({
        message: 'No se proporcionaron campos válidos para actualizar.',
      });
    }

    await order.update(filteredData);

    return res.status(200).json({
      message: 'Orden actualizada exitosamente',
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error al actualizar la orden',
      error,
    });
  }
};

// En esta función, se rastrea un envío,
// Se verifica que el UUID sea válido antes de hacer la búsqueda,
// Se realiza el JOIN entre Orders y OrderStatuses usando el alias correcto,
// Se trae solo el nombre del estado,
// Se retornan los detalles de la orden, incluyendo el nombre del estado.
const trackOrderByUuid = async (req, res) => {
  const { uuid } = req.params;

  console.log(`Incoming request to track order with UUID: ${uuid}`); 
  if (!validate(uuid)) {
    console.log('UUID no válido'); 
    return res.status(400).json({ error: 'UUID no válido' });
  }

  try {
    console.log('Buscando la orden en la base de datos...'); 

    const order = await Order.findOne({
      where: { orderCode: uuid },
      include: {
        model: OrderStatus,  
        as: 'status',        
        attributes: ['name'], 
      },
    });

    if (order) {
      console.log('Orden encontrada:', order.toJSON());

      res.status(200).json({
        ...order.toJSON(),
        current_status: order.status.name, 
      });
    } else {
      console.log('Orden no encontrada'); 
      res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    console.error('Error al buscar la orden:', error); 
    return res.status(500).json({ message: 'Error al encontrar la orden', error });
  }
};


/* 
Esta función elimina una orden específica por su ID.
Primero busca la orden en la base de datos usando findByPk.
Si la orden no se encuentra, responde con un mensaje de error y código de estado 404.
Si la orden existe, se elimina usando el método destroy y se responde con un mensaje de éxito y código de estado 200.
Si ocurre un error durante el proceso de eliminación, se captura y responde con un mensaje de error y código de estado 500.
 */
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    await order.destroy();
    return res.status(200).json({ message: 'Orden eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar la orden', error });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  updateOrder,
  trackOrderByUuid,
  deleteOrder,
};
