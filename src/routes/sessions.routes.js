import { Router } from "express";
import passport from "passport";
import { generateToken } from "../helpers/jwt.js";
import { passportCall } from "../helpers/passportCall.js";

import UserManager from "./../dao/manager/mongoUsers.js";
const newUser = new UserManager();

const router = Router();

//ruta con passport para register, si falla va a /registerFail
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/session/registerFail",
  }),
  async (_req, res) => {
    res.status(201).json({
      success: true,
      message: "Usuario creado con exito",
    });
  }
);

//ruta si falla register
router.get("/registerFail", (req, res) => {
  res.status(400).json({
    success: false,
    message: req.session.message,
  });
});

// ruta login con passport y cookies
router.post(
  "/login",
  passportCall('login'), // llamo a mi middleware y ya no me hace falta loginFaile
  async (req, res) => {
    try {
      const user = {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        id: req.user.id,
      };
      //aca todo ok
      const accessToken = generateToken(user);

      // envio desde una cookie
      res
        .cookie("authToken", accessToken, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true // indica que la cookie no se va a poder acceder por ningun medio salvo por http (unicamnete por backend)
        })
        .sendStatus(200);
    } catch (error) {
      console.log(`Error en ruta login: ${error}`);
    }
  }
);


// se va porque cree mi propio middle de passport para los errores
// router.get("/loginFail", (req, res) => { 
//   res.status(400).json({
//     success: false,
//     message: req.session.message,
//   });
// });

// Ruta para destruir la sesión
router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error al destruir la sesión:", error);
      return res.status(500).json({ message: "Error al destruir la sesión" });
    }
    res.clearCookie("connect.sid"); // Elimina la cookie de sesión en el cliente
    res
      .status(200)
      .json({ success: true, message: "Sesión destruida exitosamente" });
  });
});

// JWT  --> se muda a Login para trabajar con cookies

// router.post("/jwtlogin", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
//       const user = {
//         name: `Admin`,
//         email: "adminCoder@coder.com",
//         role: "Admin",
//         id: 0,
//       };

//       //genero token
//       const accessToken = generateToken(user);
//       return res.status(200).json({
//         success: true,
//         token: accessToken,
//       });
//     }

//     const result = await newUser.loginUser(email, password);

//     if (result.success) {
//       //no creo la sesion, devuelvo los usuarios
//       const user = {
//         name: `${result.data.name} ${result.data.lastname}`,
//         email: result.data.email,
//         role: result.data.role,
//         id: result.data._id,
//       };
//       //aca todo ok
//       const accessToken = generateToken(user);
//       return res.status(200).json({
//         success: true,
//         token: accessToken,
//       });
//     }

//     res.status(400).json({
//       success: false,
//       message: "Credenciales incorrectas",
//     });
//   } catch (error) {
//     console.log(`Error en ruta login: ${error}`);
//   }
// });

// GITHUB authenticate

// trigger
router.get("/github", passport.authenticate("github"), (_req, _res) => {});

//autenticacion con terceros - github
router.get(
  "/githubcallback",
  passport.authenticate("github"),
  async (req, res) => {
    const user = req.user;

    req.session.user = {
      name: user.name,
      email: user.email,
      role: user.role,
      id: user.id,
    };

    res.status(200).json({
      success: true,
      message: "Logueado pero con github",
    });
  }
);

export default router;
