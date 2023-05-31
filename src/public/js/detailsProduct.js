document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll('[id^="btn-"]');

  buttons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      const buttonId = event.target.id;
      const id = buttonId.slice(4)

      axios
        .get(`/api/products/${id}`)
        .then(function (response) {

          console.log(response);
        })
        .catch(function (error) {

          console.log(error);
        })
        .finally(function () {

        });
    });
  });
});
