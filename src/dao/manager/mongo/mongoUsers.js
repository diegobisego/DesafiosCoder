import userModel from "../../models/user.js";
import { validatePassword } from "../../../helpers/bcrypt.js";
import dotenv from "dotenv";
dotenv.config();


class User {
  constructor() {}

  // create user
  createUser = async (newUser) => {
    try {

      const { first_name, last_name, email, age, password, role, cartId } = newUser;

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
        cartId

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

    console.log(user)

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
}
export default User;
