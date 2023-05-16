import chatModel from "../models/chats.js";

class Chat {
  constructor() {}

  addMessage = async (user, message) => {
    try {
      const newMessage = {
        user,
        message,
      };

      if (user == "" || message == "") {
        return {
          success: false,
          message: "El usuario o mensahe no pueden estar vacios",
        };
      }

      await chatModel.create(newMessage);

      return {
        success: true,
        message: "Mensaje creado con exito",
      };
    } catch (error) {
      return {
        success: false,
        message: `Ocurrio un errror al intentar crear el mensaje: ${error}`,
      };
    }
  };

  getMessage = async () => {
    try {
      const messageChat = await chatModel.find();

      return {
        success: true,
        message: "Mensajes obtenidos con exito",
        data: messageChat,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al obtener los mensajes: ${error}`,
      };
    }
  };
}

export default Chat;
