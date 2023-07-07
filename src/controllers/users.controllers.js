import { generateToken } from "../helpers/jwt.js";
import passport from "passport";
import { cookieStractor } from "../helpers/passportCall.js";

const loginUser = (req, res) => {
  try {
    if (req.user) {
      const user = {
        first_name: req.user.first_name,
        email: req.user.email,
        role: req.user.role,
        id: req.user.id,
      };
      //aca todo ok
      const accessToken = generateToken(user);

      // envio desde una cookie
      return res
        .cookie("authToken", accessToken, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true, // indica que la cookie no se va a poder acceder por ningun medio salvo por http (unicamnete por backend)
        })
        .json({
          success: true,
          message: "Usuario encontrado con exito",
        });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
    console.log(`Error en ruta login: ${error}`);
  }
};

const registerUser = (_req,res) => {
    res.status(201).json({
        success: true,
        message: "Usuario creado con exito",
      });
}

const logoutUser = (_req,res) => {
  res.clearCookie("authToken"); // Elimina la cookie de sesión en el cliente
  res.status(200).json({ success: true, message: "Sesión destruida exitosamente" });
}

const loginWithGitHub = (req,res) => {
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

const currentJWT = (req,res) => {
  const token = cookieStractor(req);
  const user = req.user;
  const userWithToken = {
      ...user,
      token: token
  };
  res.send(userWithToken);
}

export default {
    loginUser,
    registerUser,
    logoutUser,
    loginWithGitHub,
    currentJWT
}
