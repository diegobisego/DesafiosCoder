const alertDetailsProduct = async (
  _id,
  title,
  description,
  price,
  stock,
  thumbnails
) => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: `${title}`,
      imageUrl: `${thumbnails}`,
      html: `
          <p>Description: ${description}</p>
          <p>Price: $${price}</p>
          <p>Stock: ${stock} Unidades</p>
        `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Add to Cart",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Added product!", "Your product has been added.", "success");
        resolve(_id);
      } else {
        resolve(false);
      }
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
