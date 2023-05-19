const socket = io(); //inicializa el socket y pide info del handshake

const chatMessage = document.getElementById("chatMessage");
const email = document.getElementById("email");
const message = document.getElementById("message");
const button = document.getElementById("btnMessage");

// Manejar el evento click del boton
button.addEventListener("click", async () => {
  const userEmail = email.value;
  const userMessage = message.value;

  socket.emit("chat:saveMessage", { user: userEmail, message: userMessage });

  email.value = "";
  message.value = "";
});

socket.on("chat:allMessage", (dataChat) => {
  let chats = "";

  dataChat.forEach((value) => {
    chats += `<li>user: ${value.user} | message: ${value.message}</li>`;
  });

  chatMessage.innerHTML = chats;
});
