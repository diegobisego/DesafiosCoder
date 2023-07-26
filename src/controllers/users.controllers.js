import classTokenDTO from "../dtos/users/jwtDTO.js";
import { cookieStractor } from "../helpers/passportCall.js";
import UserLoginDTO from "../dtos/users/loginUserDTO.js";



const loginUser = (req, res) => {
  try {
    if (req.user) {

      // dtos para user y token
      const user = new UserLoginDTO(req.user)
      const TokenDTO = new classTokenDTO(user)

      // aca todo ok
      const accessToken = TokenDTO.generateToken();

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
  const {first_name, email, role, id} = req.user;

    req.session.user = new UserLoginDTO(first_name, email, role, id)

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
