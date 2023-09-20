import classTokenDTO from "../dtos/users/jwtDTO.js";
import { cookieStractor } from "../helpers/passportCall.js";
import UserLoginDTO from "../dtos/users/loginUserDTO.js";
import { UserService } from "../services/index.js";
import TokenDTO from "../dtos/users/jwtDTO.js";
import MailingService from "../services/mailingService.js";
import DTemplates from "../constants/DTemplates.js";
import { validatePassword } from "../helpers/bcrypt.js";
 




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
const logoutUser = async (req, res) => {
  try {
    const {id} = req.user.user; 

    // Actualizar la propiedad last_connection después del cierre de sesión
    await UserService.logoutUpdate(id);

    res.clearCookie("authToken"); // Elimina la cookie de sesión en el cliente
    res
      .status(200)
      .json({ success: true, message: "Sesión destruida exitosamente" });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: `Ocurrio un error al intentar desloguearse: ${error}`,
    });
  }
};

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

  const {email, password} = req.body

  // verifico si existe el mail
  const existEmail = await UserService.existUser(email)

  const oldPasswordHashed = existEmail.payload.password

  // verifica si es la misma pass q la guardada
  const isMatch = await validatePassword(password, oldPasswordHashed);


  if (existEmail.success && !isMatch) {
    const result = await UserService.changeUserPassword(email,password)
    return res.status(200).json({
      success:result.success,
      message: result.message
    })
  }

  res.status(400).json({
    success: false,
    message: "Usuario inexistente o misma contraseña ingresada"
  })

}

const changeRoleUser = async (req, res) => {
  const { uid } = req.params;

  try {
    // Verifica si el usuario ha cargado todos los documentos requeridos antes de proceder
    const user = await UserService.getUserById(uid);
    const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];

    const userDocuments = user.documents.map(doc => doc.name);

    const hasAllRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

    // Verifica si el usuario ya es "Premium" o no ha cargado todos los documentos requeridos
    if (user.role === 'premium' || !hasAllRequiredDocuments) {
      return res.status(400).json({ error: 'El usuario no puede cambiar su rol a "premium" en este momento' });
    }

    // Cambia el rol del usuario a "premium"
    const result = await UserService.changeRole(uid);

    res.status(200).json({ message: "Rol cambiado a premium con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cambiar el rol del usuario" });
  }
};


const uploadDocuments = async (req, res) => {
  const userId = req.params.uid; // ID del usuario desde la URL
  const uploadedFiles = req.files; // Archivos subidos por el usuario
  const documents = []; // Array para almacenar los documentos subidos

  // Verifica si el usuario existe
  const user = await UserModel.findById(userId);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Agrega los documentos subidos al array de documentos del usuario
  uploadedFiles.forEach((file) => {
    documents.push({
      name: file.originalname, // Nombre del documento
      reference: file.filename, // Referencia al archivo subido (nombre del archivo en el sistema)
    });
  });

  // Agrega los documentos al usuario
  user.documents = [...user.documents, ...documents];

  // Guarda los cambios en la base de datos
  try {
    await user.save();
    res.status(200).json({ message: 'Documentos subidos y agregados al usuario con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar los documentos en el usuario' });
  }
};






export default {
    loginUser,
    registerUser,
    logoutUser,
    loginWithGitHub,
    currentJWT,
    restoreEmail,
    restorePassword,
    postRestorePassword,
    changeRoleUser,
    uploadDocuments
}
