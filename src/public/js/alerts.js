const alertDetailsProduct = async (
  _id,
  title,
  description,
  price,
  quantity,
  thumbnails
) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: `${title}`,
      imageUrl: `${thumbnails}`,
      html: `
          <p>Description: ${description}</p>
          <p>Price: $${price}</p>
          <p>quantity: ${quantity} Unidades</p>
        `,
      showCancelButton: true,
      cancelButtonColor: "#d33",
    });
  });
};

// aca va metido el registro
const alertRegister = () => {
  Swal.fire({
    title: "Registro",
    html: `
      <input type="text" id="first_name" class="swal2-input" placeholder="Nombre">
      <input type="text" id="last_name" class="swal2-input" placeholder="Apellido">
      <input type="Number" id="age" class="swal2-input" placeholder="Edad">
      <input type="email" id="email" class="swal2-input" placeholder="email">
      <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
    `,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Registrar",
    focusConfirm: false,
    preConfirm: () => {
      const first_name = Swal.getPopup().querySelector("#first_name").value;
      const last_name = Swal.getPopup().querySelector("#last_name").value;
      const age = Swal.getPopup().querySelector("#age").value;
      const email = Swal.getPopup().querySelector("#email").value;
      const password = Swal.getPopup().querySelector("#password").value;

      // Expresión regular para validar el formato de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!first_name || !last_name || !age || !email || !password) {
        Swal.showValidationMessage("Por favor, complete todos los datos");
        return false;
      }

      if (!email.match(emailRegex)) {
        Swal.showValidationMessage(
          "El correo electrónico ingresado no es válido"
        );
        return false;
      }

      return { first_name, last_name, age, email, password };
    },
  }).then((result) => {
    if (result.dismiss !== Swal.DismissReason.cancel) {
      const newUser = result.value;
      axios
        .post("/api/session/register", newUser)
        .then((response) => {
          if (response.data.success) {
            Swal.fire({
              position: "top",
              icon: "success",
              title: `${response.data.message}`,
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `${response.data.message}`,
              footer:
                '<a href="http://localhost:8080/login">Has click aqui para ir al logIn</a>',
            });
          }
        })
        .catch((err) => `Hubo un error al agregar al usuario: ${err}`);
    }
  });
};

const alertRecuperar = () => {
  Swal.fire({
    title: "Recuperar Constraseña",
    html: `
      <input type="text" id="restoreEmail" class="swal2-input" placeholder="correo@correo.com">
    `,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "recuperar",
    focusConfirm: false,
    preConfirm: () => {
      const email = Swal.getPopup().querySelector("#restoreEmail").value;

      // Expresión regular para validar el formato de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        Swal.showValidationMessage(
          "Por favor, complete correctamente el correo de restauracion"
        );
        return false;
      }

      if (!email.match(emailRegex)) {
        Swal.showValidationMessage(
          "El correo electrónico ingresado no es válido"
        );
        return false;
      }

      return { email };
    },
  }).then((result) => {
    if (result.dismiss !== Swal.DismissReason.cancel) {
      const email = result.value;
      axios
        .post("/api/session/restoreEmail", email)
        .then((response) => {
          if (response.data.success) {
            Swal.fire({
              position: "top",
              icon: "success",
              title: `${response.data.message}`,
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `${response.data.message}`,
              footer:
                '<a href="http://localhost:8080/login">Has click aqui para ir al logIn</a>',
            });
          }
        })
        .catch((err) => `Hubo un error al enviar el correo: ${err}`);
    }
  });
};

const alertLogout = () => {
  Swal.fire({
    title: "Desconexion",
    text: "¿Desea cerrar sesion?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d32",
    cancelButtonColor: "#abb",
    confirmButtonText: "Cerrar Sesion",
  }).then((result) => {
    if (result.isConfirmed) {
      //redirijo a la ruta para el destroy
      axios
        .post("/logout")
        .then((response) => {
          if (response.data.success) {
            window.location.replace("/login");
          }
        })
        .catch((err) => {
          console.log(`Error al redirigir a login: ${err}`);
        });
    }
  });
};

const alertEditProduct = async (id) => {
  Swal.fire({
    title: "Editar Producto",
    html:
      '<input id="title" class="swal2-input" placeholder="Title">' +
      '<input id="description" class="swal2-input" placeholder="Description">' +
      '<input id="price" class="swal2-input" placeholder="Price">' +
      '<input id="quantity" class="swal2-input" placeholder="Quantity">' +
      '<select id="status" class="swal2-select">' +
      '  <option value="true">True</option>' +
      '  <option value="false">False</option>' +
      "</select>" +
      '<input id="thumbnails" class="swal2-input" placeholder="Thumbnails">',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Save",
    showLoaderOnConfirm: true,
    preConfirm: () => {
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const price = document.getElementById("price").value;
      const quantity = document.getElementById("quantity").value;
      const status = document.getElementById("status").value;
      const thumbnails = document.getElementById("thumbnails").value;

      // Puedes realizar aquí alguna validación de los campos ingresados si es necesario

      const product = {
        description: description,
        price: price,
        quantity: quantity,
        status: status,
        thumbnails: thumbnails,
        title: title,
      };

      return {
        id,
        product,
      };
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then(async (result) => {
    if (result.isConfirmed) {
      const product = result.value.product;
      const productData = {};

      Object.keys(product).forEach((key) => {
        const value = product[key];
        if (value !== undefined && value !== null && value !== "") {
          productData[key] = value;
        }
      });

      try {
        debugger;
        const resultPut = await axios.put(
          `/api/products/${result.value.id}`,
          productData
        );

        if (resultPut.data.success) {
          Swal.fire("Producto Editado con exito");
        } else {
          return {
            success: resultPut.data.success,
            message: resultPut.data.message,
          };
        }
      } catch (error) {
        Swal.fire("Verifica los campos, caracteres invalidos");

        console.error("Error en alertEditProduct: ", error);
      }
    }
  });
};

const alertDeleteProduct = async (id) => {
  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton:
        "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
      cancelButton:
        "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded",
    },
    buttonsStyling: false,
  });

  swalWithTailwindButtons
    .fire({
      title: "¿Estás seguro que deseas eliminar el producto?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/products/${id}`)
          .then((response) => {
            if (response.data.success) {
              swalWithTailwindButtons.fire("¡Producto Eliminado!");
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else {
              swalWithTailwindButtons.fire("No se pudo eliminar el producto!");
            }
          })
          .catch((error) => {
            // Manejar la respuesta de error si es necesario
            console.error("Ocurrio un error al eliminar el producto: ", error);
          });
      }
    });
};

const alertAddProduct = async () => {
  const { value: formValues } = await Swal.fire({
    title: "Agregar Nuevo Producto",
    html: `
      <input id="swal-input-title" class="swal2-input" placeholder="Título" required>
      <input id="swal-input-description" class="swal2-input" placeholder="Descripción" required>
      <input id="swal-input-code" class="swal2-input" type="number" placeholder="Código" required>
      <input id="swal-input-price" class="swal2-input" type="number" placeholder="Precio" required>
      <input id="swal-input-quantity" class="swal2-input" type="number" placeholder="Cantidad" required>
      <input id="swal-input-category" class="swal2-input" placeholder="Categoría" required>
      <input id="swal-input-thumbnails" class="swal2-input" placeholder="URLs de imágenes separadas por comas" required>
    `,
    showCancelButton: true,
    confirmButtonText: "Agregar",
    cancelButtonText: "Cancelar",
    focusConfirm: false,
    preConfirm: () => {
      return {
        title: document.getElementById("swal-input-title").value,
        description: document.getElementById("swal-input-description").value,
        code: document.getElementById("swal-input-code").value,
        price: document.getElementById("swal-input-price").value,
        quantity: document.getElementById("swal-input-quantity").value,
        category: document.getElementById("swal-input-category").value,
        thumbnails: document
          .getElementById("swal-input-thumbnails")
          .value.split(",")
          .map((url) => url.trim()),
      };
    },
  });

  if (formValues) {
    const newProducto = {
      title: formValues.title,
      description: formValues.description,
      code: formValues.code,
      price: formValues.price,
      quantity: formValues.quantity,
      category: formValues.category,
      thumbnails: formValues.thumbnails,
    };

    try {
      // Realizar la petición POST con Axios
      const response = await axios.post("/api/products", newProducto);

      if (response.data.success) {
        // Si la respuesta es exitosa, actualizar la vista o realizar cualquier acción necesaria
        console.log("Producto agregado exitosamente:", response.data.message);
      } else {
        // Manejar errores si es necesario
        console.error("Error al agregar el producto:", response.data.message);
      }
    } catch (error) {
      // Manejar errores de conexión o problemas con la petición
      console.error("Se produjo un error en la petición:", error);
    }
  }
};

const getCartFromCurrent = async () => {
  try {
    // Realiza una solicitud GET al endpoint /current para traer los datos del usuario actual
    const response = await axios.get("/current");

    if (response.status !== 200) {
      throw new Error("No se pudo obtener la información del usuario.");
    }

    // lo guardo en una constante
    const user = response.data.user;

    // Datos del usuario
    const {emailDestination, cartId} = user

    // get al carrito del usuario
    const cart = await axios.get(`/api/carts/${cartId}`)

    const cartProdcuts = cart.data.data.products

   
    // // Llama a la función alertCart con los datos necesarios
    alertCart(cartProdcuts, cartId,  emailDestination);
  } catch (error) {
    console.error(error.message);
    // Maneja el error apropiadamente, por ejemplo, mostrando un mensaje de error al usuario
  }
};


// Función para mostrar el carrito y permitir eliminar productos
const alertCart = async (cartProdcuts, cartId,  emailDestination) => {
  const swalWithBootstrapButtons = await Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  // Verificar si hay productos en el carrito
  if (cartProdcuts) {
    // Construir el mensaje del carrito
    let cartMessage = "<ul>";
    cartProdcuts.forEach((product, index) => {
      cartMessage += `<li>${index + 1}. Nombre: ${
        product.product.title
      }, Precio: $${product.product.price}, Cantidad: ${
        product.quantity
      }, Total: $${product.price}</li>`;
    });
    cartMessage += "</ul>";

    swalWithBootstrapButtons
      .fire({
        title: "Detalle del Carrito",
        html: cartMessage,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Comprar",
        cancelButtonText: "Volver",
      })
      .then((result) => {
        if (result.isConfirmed) {
          // Realiza la llamada a la API para realizar la compra
          axios
            .post(`/api/carts/${cartId}/purchase`, {
              emailDestination
            })
            .then((response) => {
              console.log('respuesta de la api: ', response)
              // Verifica la respuesta de la API
              if (response.data.success) {
                // Si la compra se realizó con éxito, muestra un mensaje de éxito
                Swal.fire(
                  "¡Compra realizada!",
                  "Tu orden ha sido procesada.",
                  "success"
                );
              } else {
                // Si la compra falló, muestra un mensaje de error
                Swal.fire(
                  "Error",
                  "Hubo un problema al procesar tu orden.",
                  "error"
                );
              }
            })
            .catch((error) => {
              // Si ocurre un error en la llamada a la API, muestra un mensaje de error
              console.error("Error al realizar la compra:", error);
              Swal.fire(
                "Error",
                "Hubo un problema al procesar tu orden.",
                "error"
              );
            });
        }
      });
  } else {
    // Si no hay productos en el carrito
    swalWithBootstrapButtons.fire({
      title: "Carrito Vacío",
      text: "No hay productos en el carrito.",
      icon: "info",
      confirmButtonText: "Cerrar",
    });
  }
};


