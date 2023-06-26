const linkRegister = document.getElementById("registerLink");
const loginForm = document.getElementById("loginForm");
const emailLogin = document.getElementById("email");
const passwordLogin = document.getElementById("password");

linkRegister.addEventListener("click", () => {
  alertRegister();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const user = {};
  data.forEach((value, key) => (user[key] = value));
  const { email, password } = user;

  //post a jwt para verificar login y crear el token
  axios
    .post("/api/session/login", { email, password })
    .then((response) => {

      if (!response.data.status) {
        // Configurar el encabezado personalizado
        // const headers = { Authorization: `Bearer ${response.data.token}` };

        // Guardar el token en el almacenamiento local
        // localStorage.setItem('authToken', response.data.token);

        // Se realiza la redireccion
        Swal.fire('El usuario no existe')
      } else {
        window.location.href = "/welcome";
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
