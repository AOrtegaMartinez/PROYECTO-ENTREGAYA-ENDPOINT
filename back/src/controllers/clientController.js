const Client = require('../models/Client');

/* 
Esta función obtiene todos los clientes de la base de datos.
Utiliza el método findAll para recuperar todos los registros de clientes.
Responde con una lista de todos los clientes y un código de estado 200.
Si ocurre un error durante la obtención de los clientes, responde con un mensaje de error y código de estado 500. 
*/
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los clientes', error });
  }
};

/* 
Esta función obtiene un cliente específico por su ID.
Busca el cliente en la base de datos utilizando findByPk con el ID proporcionado en los parámetros de la solicitud.
Si el cliente no se encuentra, responde con un mensaje de error y código de estado 404.
Si el cliente se encuentra, responde con los datos del cliente y un código de estado 200.
Si ocurre un error durante la obtención, responde con un mensaje de error y código de estado 500. 
*/
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    return res.status(200).json(client);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el cliente', error });
  }
};

/* 
Esta función elimina un cliente específico por su ID.
Busca el cliente utilizando findByPk con el ID proporcionado en los parámetros de la solicitud.
Si el cliente no se encuentra, responde con un mensaje de error y código de estado 404.
Si el cliente existe, lo elimina usando el método destroy y responde con un mensaje de éxito y código de estado 200.
Si ocurre un error durante la eliminación, responde con un mensaje de error y código de estado 500. 
*/
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    await client.destroy();
    return res.status(200).json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el cliente', error });
  }
};

module.exports = {
  getAllClients,
  getClientById,
  deleteClient,
};
