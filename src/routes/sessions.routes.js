import { Router } from "express";
import User from "../dao/manager/mongoUsers.js";


const router = Router();

const newUser = new User();

router.post("/register", async (req, res) => {
  try {
    const { name, lastName, email, password, role } = req.body;

    const result = await newUser.createUser(
      name,
      lastName,
      email,
      password,
      role
    );

    if (result) {
      return res.status(201).json({
        success: result.success,
        message: result.message,
      });
    }

    res.status(500).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.log(`Error en ruta registro: ${error}`);
  }
});

router.post("/login",  async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await newUser.loginUser( email, password );


    if (result.success) {
      req.session.user = {
        name: `${result.data.name} ${result.data.lastname}`,
        email,
      };
      //aca todo ok
      return res.status(200).json({
        success: result.success,
        message: result.message,
      });
    }

    res.status(401).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.log(`Error en ruta login: ${error}`);
  }
});


// Ruta para destruir la sesión
router.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error al destruir la sesión:', error);
      return res.status(500).json({ message: 'Error al destruir la sesión' });
    }
    res.clearCookie('connect.sid'); // Elimina la cookie de sesión en el cliente
    res.status(200).json({ success: true, message: 'Sesión destruida exitosamente' });
  });
});

export default router;
