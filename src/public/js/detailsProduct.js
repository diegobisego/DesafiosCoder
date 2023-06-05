import alertDetailsProduct from "./alerts.js";

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll('[id^="btn-"]');

  buttons.forEach(function (button) {
    button.addEventListener("click", async function (event) {
      const buttonId = event.target.id;
      const id = buttonId.slice(4);

      try {
        const response = await axios.get(`/api/products/${id}`);
        const { _id, title, description, price, stock, thumbnails } = response.data.data;
        const result = await alertDetailsProduct(_id, title, description, price, stock, thumbnails[0]);
        var productIds = JSON.parse(localStorage.getItem('productIds')) || [];
        productIds.push(result)
        localStorage.setItem('cart', JSON.stringify(productIds));

        return {
          success: true,
          message: 'Se agrego el id de producto al carrito'
        }
      } catch (error) {
        console.log('Error en la petición Axios: ' + error);
      }
    });
  });
});

