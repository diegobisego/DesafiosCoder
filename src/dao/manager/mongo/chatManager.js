import chatModel from "../../models/chats.js";

class Chat {
  constructor() {}

  addMessage = async (user, message) => {
    try {
      if (user == "" || message == "") {
        return {
          success: false,
          message: "El usuario o mensaje no pueden estar vacios",
        };
      }
  
      await chatModel.create({ user, message });
  
      return {
        success: true,
        message: "Mensaje creado con éxito",
      };
    } catch (error) {
      console.log('Error: ' + error);
    }
  };
  

  getMessage = async () => {
    try {
      const messageChat = await chatModel.find(); //aca viene bien la data

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
