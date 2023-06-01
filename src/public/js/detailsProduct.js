import alertDetailsProduct from "./alerts.js";

const productsCart = []


document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll('[id^="btn-"]');

  buttons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      const buttonId = event.target.id;
      const id = buttonId.slice(4)

      axios
        .get(`/api/products/product/${id}`)
        .then(function (response) {
          const { title,description,price,stock, thumbnails } = response.data.data
          const result = alertDetailsProduct(title,description,price,stock,thumbnails[0])
          console.log(result)
        })
        .catch(function (error) {
          console.log('Error en la peticion Axios: ' + error);
        })
    });
  });
});
