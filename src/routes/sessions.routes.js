import { Router } from "express";
import userModel from "../dao/models/user.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    const exist = await userModel.findOne({ email });

    if (exist) {
      return res.status(200).json({
        success: false,
        message: "El usuario que intenta crear ya existe",
      });
    }

    const result = await userModel.create({ name, lastName, email, password });

    if (result) {
      return res.status(201).json({
        success: true,
        message: "Usuario creado con exito",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al intentar crear un usuario",
    });
  } catch (error) {
    console.log(`Error en ruta registro: ${error}`);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (user) {
    if (user.password === password) {
      req.session.user = {
        name: `${user.name} ${user.lastName}`,
        email,
      };

      return res.status(200).json({
        success: true, 
        message: "Usuario y contraseña correctas",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }
  }

  return res
    .status(404)
    .json({ success: false, message: "El usuario ingresado no existe" });
});

export default router;
