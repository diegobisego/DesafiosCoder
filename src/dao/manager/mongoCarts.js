import cartModel from "../models/carts.js";
import ProductManager from "./mongoProducts.js";

const mongoManagerProducts = new ProductManager();

class CartManager {
  constructor() {}

  // delete product in cart
  deleteProductInCart = async (cid, pid) => {
    try {
      const updateCart = { $pull: { products: { code: pid } } };

      const result = await cartModel.findOneAndUpdate({ id: cid }, updateCart);

      if (result) {
        return {
          success: true,
          message: "Producto eliminado con exito",
        };
      }

      return {
        success: false,
        message: "El producto no existe dentro del carrito",
      };
    } catch (error) {
      return {
        success: false,
        message: `Error en manager: ${error}`,
      };
    }
  };

  // update quantity product in cart
  putProductInCart = async (cid, pcode, quantity) => {
    try {
      const exist = await cartModel.findOne({ id: cid });

      if (!exist) {
        return {
          success: false,
          message: "El carrito con codigo indicado no existe",
        };
      }

      const cart = { id: cid }; // Consulta para encontrar el carrito
      const updateQuantity = {
        $set: { "products.$[elem].stock": quantity },
      }; // El campo stock y su nuevo valor
      const findProduct = { arrayFilters: [{ "elem.code": pcode }] }; // Filtro para identificar el producto dentro del array

      const result = await cartModel.findOneAndUpdate(cart, updateQuantity, findProduct);

      if (result.products[0].code == pcode) {
        return {
          success: true,
          message: "Producto actualizado con exito",
        };
      }

      return {
        success: false,
        message: "El producto no existe dentro del carrito",
      }
    }
    catch(error) {
      return {
        success: false,
        message: `Error en manager: ${error}`,
      };
    }
  
  }
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

  // add Carts
  addCarts = async () => {
    try {
      const carts = await this.getCarts();

      const newCart = {
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

  // get cart by id
  getCartsById = async (cid) => {
    try {
      // busca el carrito
      const cartFind = await cartModel.findOne({id:cid}).populate('products');

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

  // post products in carts
  postProductsInCarts = async (cid, pid) => {
    try {
      const { data } = await mongoManagerProducts.getProductById(pid);

      if (data) {
        await cartModel.findByIdAndUpdate(
          { id: cid },
          { $push: { products: data } }
        );

        return {
          success: true,
          message: "Se agrego el producto en forma correcta",
        };
      }

      return {
        success: false,
        message: "El producto no existe",
      };
    } catch (error) {
      return {
        success: false,
        message: `Se produjo un error al intentar agregar un producto al carrito: ${error}`,
      };
    }
  };

  // delete cart
  deleteCart = async (cid) => {
    try {
      const result = await cartModel.findByIdAndDelete({ cid });

    if (result) {
      return {
        success: true,
        message: "Carrito eliminado con exito",
      };
    }

    return {
      success: false,
      message: "Carrito no encontrado",
    };
    } catch (error) {
      return {
        success: false,
        message: `Se produjo un error al intentar borrar el carrito: ${error}`,
      };
    }
    
  };
}

export default CartManager;
