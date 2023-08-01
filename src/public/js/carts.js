document.addEventListener("DOMContentLoaded", async function () {
  const buttonsBuy = document.querySelectorAll('[id^="buy-btn-"]');
  const buttonsEdit = document.querySelectorAll('[id^="btn-edit-"]');
  const buttonsDelete = document.querySelectorAll('[id^="btn-delete-"]');
  const buttonsAddProduct = document.getElementById('buttonsAddProduct');

  const response = await axios.get(`/current`);
  const role = response.data.user.role;

  // verifico el rol y oculto el boton en caso que no sea admin
  if (role === "Usuario") {
    buttonsEdit.forEach(function (button) {
      button.classList.add("hidden-btn");
    });
    buttonsDelete.forEach(function (button) {
      button.classList.add("hidden-btn");
    });
    buttonsAddProduct.classList.add("hidden-btn")
  }

  // boton para agregar producto al carrito
  buttonsBuy.forEach(function (button) {
    button.addEventListener("click", async function (event) {
      const buttonId = event.target.id;
      const id = buttonId.slice(8);

      try {
        // Obtener el producto del servidor
        const response = await axios.get(`/api/products/${id}`);
        const product = response.data;

        // Validar si el producto existe
        if (!product) {
          console.log("Error: El producto no existe.");
          return { success: false, message: "Producto no encontrado." };
        }

        // Obtener el precio del producto desde la respuesta del servidor
        const price = product.data.price;

        // Obtener la cantidad del producto actual
        const cantElement = document.getElementById("cantBuy-" + id);
        const cantText = cantElement.innerText;
        const cant = parseInt(cantText);

        // Validar si la cantidad es un número válido
        if (isNaN(cant)) {
          console.log("Error: La cantidad no es un número válido.");
          return { success: false, message: "Cantidad inválida." };
        }

        // Obtener el precio final
        const finalPriceProduct = cant * price;

        // Armar el objeto del producto para agregar al carrito
        const productInCart = {
          idProduct: id,
          quantity: cant,
          finalPrice: finalPriceProduct,
        };

        // Obtener el ID del usuario y el ID del carrito
        const userCurrent = await axios.get("/current");
        const cartId = userCurrent.data.user.cartId;

        // Hacer la petición para agregar el producto al carrito
        const resultBuy = await axios.post(
          `/api/carts/${cartId}/product/${id}`,
          productInCart
        );

        // Verificar la respuesta del servidor
        if (resultBuy.data.success) {
          console.log(
            "Resultado luego de agregar el producto:",
            resultBuy.data
          );
        } else {
          console.log(
            "Error al agregar el producto al carrito:",
            resultBuy.data.message
          );
        }
      } catch (error) {
        console.log("Error en la petición Axios:", error);
      }
    });
  });

  // boton para editar el producto (solo admin)
  buttonsEdit.forEach(function (button) {
    button.addEventListener("click", async function (event) {
      const buttonId = event.target.id;
      const id = buttonId.slice(9);

      try {
        await alertEditProduct(id);
      } catch (error) {
        console.error("Se produjo un error en editar producto: ", error);
      }
    });
  });

  // boton para eliminar el producto (solo admin)
  buttonsDelete.forEach(function (button) {
    button.addEventListener("click", async function (event) {
      const buttonId = event.target.id;
      const id = buttonId.slice(11);

      try {
        await alertDeleteProduct(id);
      } catch (error) {
        console.error("Se produjo un error en eliminar producto: ", error);
      }
    });
  });

  

});

const btnAgregarProducto = document.getElementById('btnAgregarProducto')

buttonsAddProduct.addEventListener('click', () => {
  alertAddProduct()
})
