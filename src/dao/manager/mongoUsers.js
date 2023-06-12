import userModel from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

class User {
  constructor() {}

  // create user
  createUser = async (name, lastname, email, password, role) => {
    try {
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
        role: role || "usuario",
      });

      if (result) {
        return {
          success: true,
          message: "Usuario creado con exito",
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
          data: user
        };
      } else {
        return {
          success: false,
          message: "Contraseña incorrecta",
        };
      }
    }

    return res
      .status(404)
      .json({ success: false, message: "El usuario ingresado no existe" });
  };
}

export default User;
