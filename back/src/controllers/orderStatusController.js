const { OrderStatus } = require('../models');

/* 
Esta función obtiene todos los estados de las órdenes.
Utiliza el método findAll de OrderStatus para recuperar todos los registros de los estados.
Responde con la lista de estados y un código de estado 200.
Si ocurre un error durante la obtención de los estados, responde con un mensaje de error y código de estado 500. 
*/
const getOrderStatuses = async (req, res) => {
  try {
    const statuses = await OrderStatus.findAll(); 
    return res.status(200).json(statuses); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los estados', error });
  }
};

/* 
Esta función crea un nuevo estado de orden.
Verifica si el estado ya existe en la base de datos utilizando el campo name.
Si el estado ya existe, responde con un mensaje de error y código de estado 400.
Si el estado no existe, crea un nuevo estado utilizando el valor name proporcionado en el cuerpo de la solicitud.
Devuelve un mensaje de éxito con el estado recién creado y un código de estado 201.
Si ocurre un error durante la creación, responde con un mensaje de error y código de estado 500. 
*/
const createOrderStatus = async (req, res) => {
  const { name } = req.body; 

  try {
    const existingStatus = await OrderStatus.findOne({ where: { name } });
    if (existingStatus) {
      return res.status(400).json({ message: 'El estado ya existe' });
    }

    // Crear el nuevo estado
    const newStatus = await OrderStatus.create({ name });
    return res.status(201).json({ message: 'Estado creado exitosamente', status: newStatus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear el estado', error });
  }
};

/* 
Esta función actualiza un estado de orden específico por su ID.
Busca el estado utilizando findByPk con el ID proporcionado en los parámetros de la solicitud.
Si el estado no se encuentra, responde con un mensaje de error y código de estado 404.
Si el estado existe, actualiza el campo name con el valor proporcionado en el cuerpo de la solicitud.
Guarda los cambios en la base de datos y responde con el estado actualizado y un mensaje de éxito con código de estado 200.
Si ocurre un error durante la actualización, responde con un mensaje de error y código de estado 500. 
*/
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const status = await OrderStatus.findByPk(id);
    if (!status) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }

    // Actualizar el estado
    status.name = name;
    await status.save();

    return res.status(200).json({ message: 'Estado actualizado exitosamente', status });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar el estado', error });
  }
};

/* 
Esta función elimina un estado de orden específico por su ID.
Busca el estado utilizando findByPk con el ID proporcionado en los parámetros de la solicitud.
Si el estado no se encuentra, responde con un mensaje de error y código de estado 404.
Si el estado existe, lo elimina utilizando el método destroy y responde con un mensaje de éxito y código de estado 200.
Si ocurre un error durante la eliminación, responde con un mensaje de error y código de estado 500. 
*/
const deleteOrderStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await OrderStatus.findByPk(id);
    if (!status) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }

    // Eliminar el estado
    await status.destroy();
    return res.status(200).json({ message: 'Estado eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar el estado', error });
  }
};

module.exports = {
  getOrderStatuses,
  createOrderStatus,
  updateOrderStatus,
  deleteOrderStatus,
};
