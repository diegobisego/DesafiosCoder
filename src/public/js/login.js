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

  console.log('Hasta el axios llego')
  axios
    .post("/api/session/login", { email, password })
    .then((response) => {
      console.log('estoy en logon.js: ' + JSON.stringify(response))
      
      if (response.data.success) {
        window.location.replace("http://localhost:8080/welcome");
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
