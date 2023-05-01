const socket = io();//inicializa el socket y pide info del handshake

socket.on('arrayProducts', data => {
    const listProducts = document.getElementById('listProducts')
    let products = ''

    data.foreach(value => {
        products += `<li>title: ${value.id} | price: ${value.price}</li>`
    })

    listProducts.innerHTML = products
})
//aca va el screen 18