document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll('[id^="btn-"]');

  buttons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      const buttonId = event.target.id;
      // Hacer algo con el ID del botón...
      console.log("ID del botón:", buttonId);

      axios
        .get("/products")
        .then(function (response) {
          // handle success
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
    });
  });
});
