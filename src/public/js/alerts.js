// import Swal from "sweetalert2"
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
};

export default alertDetailsProduct;
