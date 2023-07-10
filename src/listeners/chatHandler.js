import Chat from "../dao/manager/mongo/chatManager.js";

const newChatManager = new Chat();

const registerChatHandler = (io, socket) => {
  // se agrega un nuevo mensaje y se actualiza la lista
  const saveMessage = async (dataSave) => {

    // agrego mje a la base
    const { user, message } = dataSave
    await newChatManager.addMessage(user, message);

    //obtengo los mensajes y mando un emit
    const mongoChats = await newChatManager.getMessage();
    const dataChats = mongoChats.data
    io.emit("chat:allMessage", dataChats);
  };

  // aplicar el evento
  socket.on("chat:saveMessage", saveMessage);
};

export default registerChatHandler;
