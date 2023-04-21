import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  // get carts
  getCarts = async () => {
    try {
      const carts = await fs.promises.readFile(this.path, "utf-8");

      const result = JSON.parse(carts);

      return {
        success: true,
        message: "Carritos obtenidos con exito",
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: "No hay carritos para mostrar",
      };
    }
  };

  // add Carts
  addCarts = async () => {
    const newCarts = {
      products: this.products,
    };

    // verificacion y save de Carts
    try {
      //si no existe ningun productos
      if (!fs.existsSync(this.path)) {
        const arrayCarts = [];
        const id = 1;
        arrayCarts.push({ id, ...newCarts });

        const result = await fs.promises
          .writeFile(this.path, JSON.stringify(arrayCarts))
          .then(() => {
            return {
              success: true,
              message: "Archivo y carrito creado con exito",
            };
          })
          .catch((err) => {
            return {
              success: false,
              message: `Error al crear el archivo: ${err}`,
            };
          });
        return result;
      }

      const result = await this.getCarts();
      const carts = result.data;

      // verifica si el codigo existe
      //   const exist = carts.some((value) => value.code == code);
      //   if (exist) {
      //     return {
      //       success: false,
      //       message: "El codigo de producto ya existe"
      //     };
      //   }

      //id del cart y push
      const id = carts[carts.length - 1].id + 1;

      carts.push({ id, ...newCarts });
      const cartsArray = JSON.stringify(carts);

      //guardo en archivo
      return await fs.promises
        .writeFile(this.path, cartsArray)
        .then(() => {
          return {
            success: true,
            message: "Carrito creado con exito",
          };
        })
        .catch((err) => {
          return {
            success: false,
            message: `Hubo un error al intentar agregar el carrito al archivo: ${err}`,
          };
        });
    } catch (error) {
      return {
        success: false,
        message: `Hubo un error en addCarts: ${error}`,
      };
    }
  };

  // get cart by id
  getCartsById = async (id) => {
    try {
      const cart = await this.getCarts();

      // verifica si el codigo existe
      const cartFind = cart.find((value) => value.id == id);

      // console.log(productFind)
      return {
        success: true,
        message: 'Carrito encontrado con exito',
        data: cartFind
      }

    } catch (error) {
        return {
            success: false,
            message: `No se encontro el carrito con id: ${id}`
          }
    }
  };
}

export default CartManager;
