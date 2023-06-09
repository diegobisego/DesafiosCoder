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
        resolve((_id));
      } else {
        resolve(false);
      }
    });
  });
}


const alertRegister = () => {
  Swal.fire({
    title: 'Registro',
    html: `
      <input type="text" id="name" class="swal2-input" placeholder="Nombre">
      <input type="text" id="lastname" class="swal2-input" placeholder="Apellido">
      <input type="email" id="login" class="swal2-input" placeholder="email">
      <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
    `,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Registrar',
    focusConfirm: false,
    preConfirm: () => {
      const name = Swal.getPopup().querySelector('#name').value;
      const lastname = Swal.getPopup().querySelector('#lastname').value;
      const login = Swal.getPopup().querySelector('#login').value;
      const password = Swal.getPopup().querySelector('#password').value;
      
      if (!name || !lastname || !login || !password) {
        Swal.showValidationMessage(`Por favor, complete todos los`);
      }
      
      return { name: name, lastname: lastname, login: login, password: password };
    }
  }).then((result) => {
    if (result.dismiss !== Swal.DismissReason.cancel) {
      const newUser = result.value
      console.log(newUser)
      axios.post('/register', {newUser})
      .then((response) => console.log('usuario agregado con exito'))
      .catch((err) => `Hubo un error al agregar al usuario: ${err}`)
    }
  });
  
}


