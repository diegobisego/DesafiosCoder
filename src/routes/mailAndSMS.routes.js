import config from "../config/config.js";
import nodemailer from "nodemailer";
import twilio from "twilio";
import { Router } from "express";
import __dirname from "../dirname.js";
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
router.get("/mail", async (_req, res) => {
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
    console.log("Error al enviar el mail: " + error);
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

export default router;
