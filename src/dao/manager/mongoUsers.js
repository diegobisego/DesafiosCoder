import userModel from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

class User {
  constructor() {}

  // create user
  createUser = async (newUser) => {
    try {
      const { name, lastname, email, password, role } = newUser;

      const exist = await userModel.findOne({ email });

      if (exist) {
        return {
          success: false,
          message: "El usuario que intenta crear ya existe",
        };
      }

      const result = await userModel.create({
        name,
        lastname,
        email,
        password,
        role,
      });

      if (result) {
        return {
          success: true,
          message: "Usuario creado con exito",
          data: result,
        };
      }

      return {
        success: false,
        message: "Error al intentar crear un usuario",
      };
    } catch (error) {
      console.log(`Error en ruta registro: ${error}`);
    }
  };

  loginUser = async (email, password) => {
    const user = await userModel.findOne({ email });

    if (user) {
      if (user.password === password) {
        return {
          success: true,
          message: "Usuario y contraseña correctas",
          data: user,
        };
      } else {
        return {
          success: false,
          message: "Contraseña incorrecta",
        };
      }
    }

    return {
      success: false,
      message: "El usuario ingresado no existe",
    };
  };
}

export default User;
