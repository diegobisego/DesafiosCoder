import config from "../config/config.js";
import nodemailer from "nodemailer";
import twilio from "twilio";
import { Router } from "express";
import __dirname from "../dirname.js";
import { passportCall } from "../helpers/passportCall.js";
const router = Router();

// configura la creacion del correo (llevarlo a service desp)
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.email.APP_MAIL,
    pass: config.email.APP_PASSWORD,
  },
});

// configturar twilio (llevarlo a service desp)
const twilioClient = twilio(config.sms.TWILIO_SID, config.sms.TWILIO_TOKEN);

// ruta donde se activa el envio del correo, esto viene de /api/mail
router.get("/mail", async (req, res) => {
  try {
    const mailOptions = {
      from: "Diego Bisego <diegobisego@gmail.com>",
      to: "diegobisego@gmail.com",
      subject: "Lista de Precios",
      html: `
        <div>
          <h1>Este es un mensaje desde la nueva APP, te adjunto la lista de precios</h1>
          <img src="cid:listaPrecios"/>
        </div>
      `,
      attachments: [
        {
          filename: "CV.pdf",
          path: `${__dirname}/docs/CV.pdf`,
        },
        {
          filename: "lista de precios.jpg",
          path: `${__dirname}/docs/lista de precios.jpg`,
          cid: "listaPrecios",
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error al enviar el correo:", error);
      } else {
        res.send({
          success: true,
          payload: `Correo enviado: ${info.response}`,
        });
      }
    });
  } catch (error) {
    const logger = req.logger;
    logger.error(`Se produjo un error en editar producto: ${error}`);
  }
});

// enviar sms con twilio
router.get("/sms", async (req, res) => {
  const clientNumber = config.sms.TWILIO_CLIENT_NUMBER;

  const result = await twilioClient.messages.create({
    body: "Envio de prueba de SMS",
    from: config.sms.TWILIO_NUMBER,
    to: clientNumber,
  });

  res.send({ success: true, payload: result });
});


// Servidor - Ruta para realizar la compra y enviar el correo
router.post("/realizar-compra", passportCall('jwt'), async (req, res) => {
  try {
    // Accede a los datos del usuario desde req.user
    const { first_name, email } = req.user.user; // Accede a los datos del usuario actual

    // ... Lógica para realizar la compra ...

    // Calcula el monto total de la compra (reemplaza esto con tu lógica real)
    const totalAmount = calculateTotalAmount(req.body.cart.products);

    // Genera un código de ticket (reemplaza esto con tu lógica real)
    const ticketCode = generateTicketCode();

    // Envia el correo de confirmación al correo del usuario actual
    const userEmail = email; // Utiliza el correo del usuario actual

    // Lógica para enviar el correo
    const mailOptions = {
      from: "Tu Nombre <tuemail@gmail.com>",
      to: userEmail,
      subject: "Confirmación de Compra",
      html: `
        <p>¡Gracias por tu compra, ${first_name}!</p>
        <p>Tu compra ha sido procesada exitosamente.</p>
        <p>Detalles de la compra:</p>
        <ul>
          <li>Monto Total: $${totalAmount.toFixed(2)}</li>
          <li>Código de Ticket: ${ticketCode}</li>
        </ul>
        <p>¡Esperamos verte de nuevo pronto!</p>
      `,
    };

    // Envía el correo utilizando el transporter configurado previamente
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo de confirmación:", error);
        // Maneja el error apropiadamente, por ejemplo, enviando una respuesta de error al cliente
        res.status(500).send({ success: false, message: 'Error al enviar el correo de confirmación' });
      } else {
        // ... Más lógica de compra ...

        // Envía una respuesta de éxito al cliente
        res.send({ success: true, message: 'Compra realizada con éxito' });
      }
    });

  } catch (error) {
    console.error('Error al realizar la compra:', error);
    res.status(500).send({ success: false, message: 'Error al realizar la compra' });
  }
});



export default router;
