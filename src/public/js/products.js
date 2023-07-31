document.addEventListener("DOMContentLoaded", function () {
  // Event listener para los botones de detalles de producto
  const buttons = document.querySelectorAll('[id^="btn-details-"]');

  buttons.forEach(function (button) {
    button.addEventListener("click", async function (event) {
      const buttonId = event.target.id;
      const id = buttonId.slice(12);

      try {
        const response = await axios.get(`/api/products/${id}`);
        const { _id, title, description, price, quantity, thumbnails } =
          response.data.data;
        const result = await alertDetailsProduct(
          _id,
          title,
          description,
          price,
          quantity,
          thumbnails[0]
        );
        var productIds = JSON.parse(localStorage.getItem("productIds")) || [];
        productIds.push(result);
        localStorage.setItem("cart", JSON.stringify(productIds));

        return {
          success: true,
          message: "Se agrego el id de producto al carrito",
        };
      } catch (error) {
        console.log("Error en la petición Axios: " + error);
      }
    });
  });

  // Obtener todos los botones de sumar y restar por su clase
  const btnSum = document.querySelectorAll('[data-id^="btn-sum-"]');
  const btnSubtract = document.querySelectorAll('[data-id^="btn-subtract-"]');

  // Manejar el clic en los botones de sumar
  btnSum.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.getAttribute("data-id").slice(8);
      const cantBuyElement = document.getElementById(`cantBuy-${productId}`);
      let currentQuantity = parseInt(cantBuyElement.textContent, 10);
      currentQuantity++;
      cantBuyElement.innerHTML = currentQuantity.toString();
    });
  });

  // Manejar el clic en los botones de restar
  btnSubtract.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.getAttribute("data-id").slice(13);
      const cantBuyElement = document.getElementById(`cantBuy-${productId}`);
      let currentQuantity = parseInt(cantBuyElement.textContent, 10);
      if (currentQuantity > 1) {
        currentQuantity--;
      }
      cantBuyElement.innerHTML = currentQuantity.toString();
    });
  });

  // Event listener para el botón de usuario (Logout)
  const btnLogout = document.getElementById("btnUser");
  btnLogout.addEventListener("click", () => {
    alertLogout();
  });
});
