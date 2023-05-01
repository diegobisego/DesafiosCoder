const socket = io();//inicializa el socket y pide info del handshake

const listProducts = document.getElementById('listProducts')

socket.on('arrayProducts', data => {

    let products = ''
    
    data.data.forEach(value => {
        products += `<li>title: ${value.title} | price: $${value.price}</li>`
    })

    listProducts.innerHTML = products
})
