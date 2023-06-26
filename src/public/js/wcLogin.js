//Función de bienvenida una vez que se loguea el usuario
function bienvenida() {
  const textWrapper = document.querySelector(".ml14 .letters");
  textWrapper.innerHTML = textWrapper.textContent.replace(
    /\S/g,
    "<span class='letter'>$&</span>"
  );

  anime.timeline({ loop: false })
    .add({
      targets: ".ml14 .line",
      scaleX: [0, 1],
      opacity: [0.5, 1],
      easing: "easeInOutExpo",
      duration: 900,
    })
    .add({
      targets: ".ml14 .letter",
      opacity: [0, 1],
      translateX: [40, 0],
      translateZ: 0,
      scaleX: [0.3, 1],
      easing: "easeOutExpo",
      duration: 800,
      offset: "-=600",
      delay: (el, i) => 150 + 25 * i,
    })
    .add({
      targets: ".ml14",
      opacity: 0,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000,
      complete: function () {
        // Obtener el token del almacenamiento local
        // const authToken = localStorage.getItem("authToken");
        
        // Verificar si el token existe
        // if (authToken) {
          // Configurar el encabezado personalizado
          // const headers = { Authorization: `Bearer ${authToken}` };

          // Hacer una solicitud GET para redirigir a la página de bienvenida
          // axios.get("/products", { headers })
          //   .then(() => {
              // Redirigir al usuario a la página de productos
              window.location.href = "/products";
            // })
    //         .catch((error) => {
    //           console.log(`Error en la solicitud GET a /welcome: ${error}`);
    //         });
    //     } else {
    //       console.log("No se encontró el token en el almacenamiento local");
    //     }
    //   },
    // });
}
})}

bienvenida();
