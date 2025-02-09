require('dotenv').config();
const nodemailer = require('nodemailer');

// En este archivo mailer.js, se configura 
// y utiliza Nodemailer para enviar correos electrónicos.

// Configurar el transporte de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Función para enviar correo de confirmación de orden
const sendConfirmationEmail = (userEmail, orderCode, orderDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Confirmación de Orden',
    html: `
      <h2>Confirmación de Orden</h2>
      <p>Gracias por tu pedido. Aquí están los detalles de tu orden:</p>
      <p><strong>Código de transacción:</strong> ${orderCode}</p>
      <p><strong>Tipo de Producto:</strong> ${orderDetails.package_type}</p>
      <p><strong>Nombre del destinatario:</strong> ${orderDetails.recipient_name}</p>
      <p><strong>Dirección de destino:</strong> ${orderDetails.destination_address}</p>
      <p>Por favor, sigue las instrucciones que se te proporcionaron para completar el proceso.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Función para enviar mensajes de contacto
const sendContactMessage = (formData) => {
  const mailOptions = {
    from: formData.email, 
    to: process.env.EMAIL_USER,
    subject: `Nuevo mensaje de contacto de ${formData.name}`,
    html: `
      <h2>Mensaje de Contacto</h2>
      <p><strong>Nombre:</strong> ${formData.name}</p>
      <p><strong>Teléfono:</strong> ${formData.phone}</p>
      <p><strong>Ciudad:</strong> ${formData.city}</p>
      <p><strong>Empresa:</strong> ${formData.company || 'No especificada'}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Mensaje:</strong> ${formData.message}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail, sendContactMessage };
