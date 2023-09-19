import userModel from "./../models/user.js";
import { createHash, validatePassword } from "../../../helpers/bcrypt.js";
import dotenv from "dotenv";
dotenv.config();

class User {
  constructor() {}

  // create user
  createUser = async (newUser) => {
    try {
      const { first_name, last_name, email, age, password, role, cartId } =
        newUser;

      const exist = await userModel.findOne({ email });

      if (exist) {
        return {
          success: false,
          message: "El usuario que intenta crear ya existe",
        };
      }

      const result = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password,
        role,
        cartId,
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

    if (!user) {
      return {
        success: false,
        message: "El usuario ingresado no existe",
      };
    }

    //validacion con bycript
    const isValidPassword = await validatePassword(password, user.password);

    if (isValidPassword) {
      return {
        success: true,
        message: "Usuario y contraseña correctas",
        data: user,
      };
    }

    return {
      success: false,
      message: "Contraseña incorrecta",
    };
  };

  existUser = async (email) => {
    const user = await userModel.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: "El usuario ingresado no existe",
      };
    }

    return {
      success: true,
      message: "Usuario encontrado con exito",
      payload: user,
    };
  };

  changeUserPassword = async (email, password) => {
    try {
      const hashedPassword = await createHash(password);
      await userModel.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );

      return {
        success: true,
        message: "Se realizó el cambio de contraseña correctamente",
      };
    } catch (error) {
      return {
        success: false,
        message: "Ocurrió un error al cambiar la contraseña",
      };
    }
  };

  changeRole = async (id) => {
    try {
      console.log("id en manager: ", id);
      const user = await userModel.findById(id);

      if (!user) {
        return {
          success: false,
          message: `No se encontró ningún usuario con el ID ${id}`,
        };
      }

      let role = user.role;

      if (role === "Usuario") {
        role = "premium";
      } else {
        role = "Usuario";
      }

      // Realizar la actualización del rol
      const filter = { _id: id };
      const updateDoc = { $set: { role } };

      const result = await userModel.updateOne(filter, updateDoc);

      console.log(result);

      // Devuelve una respuesta de éxito si el cambio de rol fue exitoso
      return {
        success: true,
        message: "Rol cambiado con éxito",
      };
    } catch (error) {
      return {
        success: false,
        message: `Ocurrió un error al cambiar el rol: ${error}`,
      };
    }
  };

  logoutUpdate = async (id) => {
    try {
      await userModel.findByIdAndUpdate(id, { last_connection: new Date() });
      return {
        success: true,
        message: "La conexion se actualizo con exito",
      };
    } catch (error) {
      return {
        success: false,
        message: `Ocurrió un error al actualizar la ultima conexion: ${error}`,
      };
    }
  };
}

export default User;
