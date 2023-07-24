import config from "../config/config.js";
import nodemailer from "nodemailer";
import { Router } from "express";
import __dirname from "../dirname.js";
const router = Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.email.APP_MAIL,
    pass: config.email.APP_PASSWORD,
  },
});

router.get("/", async (_req, res) => {
  try {

    const mailOptions = {
      from: "Diego Bisego <diegobisego@gmail.com>",
      to: "matiasbisego@gmail.com",
      subject: "Lista de Precios",
      html: `
        <div>
          <h1>Este es un mensaje desde la nueva APP, te adjunto la lista de precios</h1>
        </div>
      `,
      attachments: [
        {
          filename: 'lista de precios.jpg',
          path: `${__dirname}/docs/lista de precios.jpg`
        }
      ]
    };
    

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo:', error);
      } else {
        res.send({
          success: true,
          payload: `Correo enviado: ${info.response}`
        })
      }
    });
  

  } catch (error) {
    console.log('Error al enviar el mail: ' + error)
  }


});

export default router;
