export const productsErrorProductNotFound = (id) => {
    return `El id del producto ingresado no se encuentra en la base de datos, el id es: ${id}`
}

export const cartsErrorCartNotFound = (id) => {
    return `El id del carrito ingresado no se encuentra en la base de datos, el id es: ${id}`
}