const socket = io();//inicializa el socket y pide info del handshake

const chatMessage = document.getElementById('chatMessage')
const email = document.getElementById('email')
const message = document.getElementById('message')

socket.on('chat', data => {

    let chats = ''
    
    data.data.forEach(value => {
        chats += `<li>user: ${value.email.value} | message: ${value.message.value}</li>`
    })

    listProducts.innerHTML = chats
})