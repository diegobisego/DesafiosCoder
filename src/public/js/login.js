const linkRegister = document.getElementById("registerLink");
const recuperarLink = document.getElementById("recuperarLink");
const loginForm = document.getElementById("loginForm");
const emailLogin = document.getElementById("email");
const passwordLogin = document.getElementById("password");

linkRegister.addEventListener("click", () => {
  alertRegister();
});

recuperarLink.addEventListener("click", () => {
  alertRecuperar();
})

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
      if (!response.data.success) {
        // Configurar el encabezado personalizado
        // const headers = { Authorization: `Bearer ${response.data.token}` };

        // Guardar el token en el almacenamiento local
        // localStorage.setItem('authToken', response.data.token);

        // Se realiza la redireccion
        Swal.fire(`${response.data.error}`)
      } else {
        window.location.href = "/welcome";
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
