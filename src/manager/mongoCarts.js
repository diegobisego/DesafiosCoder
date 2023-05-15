import cartModel from "../models/carts.js";
import ProductManager from "./mongoProducts.js";

const mongoManagerProducts = new ProductManager();

class CartManager {
  constructor() {}

  // get carts
  getCarts = async () => {
    try {
      const carts = await cartModel.find().lean();

      if (carts.data !== []) {
        return {
          success: true,
          message: "Carritos obtenidos con exito",
          data: carts,
        };
      }

      return {
        success: false,
        message: "No existen carritos para mostrar",
        data: carts,
      };
    } catch (error) {
      return {
        success: false,
        message: `Hubo un error en la peticion de carritos: ${error}`,
      };
    }
  };

  //   // add Carts
  addCarts = async () => {
    try {
      const carts = await this.getCarts();
      const countCarts = carts.data.length + 1;

      const newCart = {
        id: countCarts,
        products: [],
      };

      const result = await cartModel.create(newCart);

      if (result) {
        return {
          success: true,
          message: "Carrito creado con exito",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error al crear el carrito: ${error}`,
      };
    }
  };

  //   // get cart by id
  getCartsById = async (id) => {
    try {
      // busca el carrito
      const cartFind = await cartModel.findOne({ id }).lean();

      if (cartFind) {
        return {
          success: true,
          message: "Carrito encontrado con exito",
          data: cartFind,
        };
      }
      return {
        success: false,
        message: `No se encontro el carrito con id: ${id}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error en la peticion del carrito: ${error}`,
      };
    }
  };

  //   //post products in carts
  //   postProductsInCarts = async (cid, pid) => {
  //     try {
  //       //traigo productos
  //       const resultProducts = await this.newProductsManager.getProducts();
  //       const products = resultProducts.data;

  //       //traigo carritos
  //       const resultCarts = await this.getCarts();
  //       const carts = resultCarts.data;

  //       //guardo producto y carrito solicitado
  //       const existProduct = products.find((value) => value.id == pid);
  //       const existCart = carts.find((value) => value.id == cid);

  //       //verifico q exista producto y carrito
  //       if (!existProduct) {
  //         return {
  //           success: false,
  //           message: "El producto solicitado no existe",
  //         };
  //       }

  //       if (!existCart) {
  //         return {
  //           success: false,
  //           message: "El carrito solicitado no existe",
  //         };
  //       }

  //       //realizo una copia de carts para trabajarla
  //       const newCarts = JSON.parse(JSON.stringify(carts));

  //       //busco el index del carrito y del producto
  //       const cartIndex = newCarts.findIndex((cart) => cart.id == cid);
  //       const productIndex = newCarts[cartIndex].products.findIndex(
  //         (product) => product.product == pid
  //       );

  //       //si es distinto a -1 el resultado,agrego el producto, sino le sumo 1
  //       if (productIndex !== -1) {
  //         newCarts[cartIndex].products[productIndex].quantity += 1;
  //       } else {
  //         newCarts[cartIndex].products.push({
  //           product: pid,
  //           quantity: 1,
  //         });
  //       }

  //       //realizo el writefile y retorno el resultado
  //       const result = await fs.promises
  //         .writeFile(this.path, JSON.stringify(newCarts))
  //         .then(() => {
  //           return {
  //             success: true,
  //             message: "Se agrego el producto en forma correcta",
  //           };
  //         });

  //       return result;
  //     } catch (error) {
  //       return {
  //         success: false,
  //         message: `Se produjo un error al intentar agregar un producto al carrito: ${error}`,
  //       };
  //     }
  //   };
}

export default CartManager;
