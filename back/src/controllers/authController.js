const bcrypt = require('bcryptjs'); // Importamos el módulo bcryptjs
const jwt = require('jsonwebtoken'); // Importamos el módulo jsonwebtoken
const Client = require('../models/Client');
const { Op } = require('sequelize');

// Se crea esta función asincrona para registrar un cliente,
// se obtienen los datos del body,
// se busca si ya existe un cliente con el correo electrónico o número de identificación proporcionado,
// si existe se retorna un mensaje de error, si no existe se crea el cliente y se retorna el cliente creado.
// se hashea la contraseña del cliente, 
// y se genera un JWT para el cliente.
const registerClient = async (req, res) => {
  const { name, lastname, ID_number, email, password, phone } = req.body;

  try {
    const existingClient = await Client.findOne({
      where: {
        [Op.or]: [{ email }, { ID_number }],
      },
    });

    if (existingClient) {
      return res.status(400).json({ message: 'Cliente ya registrado' }); 
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = await Client.create({
      name,
      lastname,
      ID_number,
      email,
      password: hashedPassword,
      phone,
    });

    const token = jwt.sign( 
      { id: newClient.id, email: newClient.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Cliente registrado exitosamente',
      client: {
        id: newClient.id,
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
      },
      token,
    });
  } catch (error) {
    console.error('Error en el registro:', error.message);
    return res.status(500).json({ message: 'Error al registrar el cliente', error: error.message });
  }
};

// Se crea esta función asincrona para iniciar sesión de un cliente,
// se obtienen los datos del body,
// se busca si existe un cliente con el correo electrónico proporcionado,
// si no existe se retorna un mensaje de error, si existe se compara la contraseña,
// si la contraseña no coincide se retorna un mensaje de error, si la contraseña coincide se genera un JWT para el cliente.
// y se retorna un mensaje de inicio de sesión exitoso, los datos del cliente y el token.
const loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ where: { email } });

    if (!client) {
      return res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, client.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: client.id, email: client.email },
      process.env.JWT_SECRET,
      { expiresIn: '21d' }
    );

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
      },
      token,
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error.message);
    return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

module.exports = { // Exportamos las funciones para registrar e iniciar sesión de un cliente
  registerClient,
  loginClient,
};
