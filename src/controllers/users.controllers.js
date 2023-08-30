import classTokenDTO from "../dtos/users/jwtDTO.js";
import { cookieStractor } from "../helpers/passportCall.js";
import UserLoginDTO from "../dtos/users/loginUserDTO.js";
import { UserService } from "../services/index.js";
import TokenDTO from "../dtos/users/jwtDTO.js";
import MailingService from "../services/mailingService.js";
import DTemplates from "../constants/DTemplates.js";




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

const currentJWT = async (req,res) => {
  const token = cookieStractor(req);
  const user = req.user;
  const userWithToken = {
    ...user,
    token: token
  };

  res.send(userWithToken);
}

const restoreEmail = async (req,res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "No se ingreso ningun correo"
      })
    }

    const exist = await UserService.existUser(email)

    if(!exist){
      return res.status(404).json({
        success: false,
        message: "No existe el correo en la base de datos"
      })
    }

    // una vez pasen las validacion se crea un restoreToken
    const classToken = new TokenDTO(email)
    const restoreToken = classToken.generateToken()


    // uso el servicio de mail una vez tokenizado
    const mailingService = new MailingService()
    const result = await mailingService.sendMail(email, DTemplates.RESTORE, {restoreToken})
    
    res.status(200).json({
      success: true,
      message: 'Correo enviado con exito'
    })


  } catch (error) {
    console.log('ocurrio un error en el envio de mail: ' , error)
  }
}

const restorePassword = async (req,res) => {
  res.render('restorePassword')
}

const postRestorePassword = async (req,res) => {
  console.log(req.body.data)
  const {email, password} = req.body

  // verifico si existe el mail
  const exitEmail = await UserService.existUser(email)

  if (exitEmail.success) {
    const result = await UserService.changeUserPassword(email,password)
    return res.status(200).json({
      success:result.success,
      message: result.message
    })
  }

  res.status(400).json({
    success: false,
    message: "Usuario inexistente"
  })

}

export default {
    loginUser,
    registerUser,
    logoutUser,
    loginWithGitHub,
    currentJWT,
    restoreEmail,
    restorePassword,
    postRestorePassword
}
