import ProductModel from "./../models/products.js";
import CartModel from "./../models/carts.js";

class CartManager {
  constructor() {}

  // get carts
  getCarts = async () => {
    try {
      const carts = await CartModel.find().lean();

      if (carts.length > 0) {
        return {
          success: true,
          message: "Carritos obtenidos con éxito",
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
        message: `Hubo un error en la petición de carritos: ${error}`,
      };
    }
  };

  // get cart by id
  getCartById = async (cid) => {
    try {
      const cart = await CartModel.findOne({ _id: cid }).populate(
        "products.product"
      );

      if (cart) {
        return {
          success: true,
          message: "Carrito encontrado con éxito",
          data: cart,
        };
      }

      return {
        success: false,
        message: `No se encontró el carrito con ID: ${cid}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error en la petición del carrito: ${error}`,
      };
    }
  };

  // add Cart
  addCart = async () => {
    try {
      const newCart = await CartModel.create({ products: [] });

      return {
        success: true,
        message: "Carrito creado con éxito",
        data: newCart,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al crear el carrito: ${error}`,
      };
    }
  };

  // post product in cart
  postProductInCart = async (cid, pid) => {
    try {
      const product = await ProductModel.findById(pid);

      if (!product) {
        return {
          success: false,
          message: "El producto no existe",
        };
      }

      // verifica que el producto no exista ya agregado al carrito
      const cartFind = await this.getCartById(cid);

      const productIndex = cartFind.data.products.findIndex(
        (product) => product._id.toString() === pid
      );
      // me quede aca, ver porq no puedo agregar el prducto
      if (productIndex !== -1) {
        return {
          success: false,
          message: "El producto ya existe en el carrito",
        };
      }

      const cart = await CartModel.findByIdAndUpdate(
        cid,
        { $push: { products: { product: { ...product, quantity: 1 } } } },
        { new: true }
      );
      

      if (cart) {
        return {
          success: true,
          message: "Se agregó el producto correctamente al carrito",
          data: cart,
        };
      }

      return {
        success: false,
        message: "No se pudo agregar el producto al carrito",
      };
    } catch (error) {
      return {
        success: false,
        message: `Se produjo un error al intentar agregar un producto al carrito: ${error}`,
      };
    }
  };

  // update quantity product in cart
  putProductInCart = async (cid, pid, quantity) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart.success) {
        return {
          success: false,
          message: "El carrito con el ID indicado no existe",
        };
      }

      const productIndex = cart.data.products.findIndex(
        (product) => product.product._id.toString() === pid
      );

      if (productIndex === -1) {
        return {
          success: false,
          message: "El producto no existe dentro del carrito",
        };
      }

      const updatedCart = await CartModel.updateOne(
        { _id: cid, "products.product": pid },
        { $inc: { "products.$.quantity": quantity } },
        { new: true }
      );
      
      

      if (!updatedCart) {
        return {
          success: false,
          message: "Error al actualizar el carrito",
        };
      }

      return {
        success: true,
        message: "Producto actualizado con éxito",
      };

    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: `Error en manager: ${error}`,
      };
    }
  };

  // delete cart
  deleteCart = async (cid) => {
    try {
      const result = await CartModel.findByIdAndDelete(cid);

      if (result) {
        return {
          success: true,
          message: "Carrito eliminado con éxito",
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

  // delete product in cart
  deleteProductInCart = async (cid, pid) => {
    try {
      const result = await CartModel.findByIdAndUpdate(cid, {
        $pull: { products: { product: pid } },
      });
      

      if (result) {
        return {
          success: true,
          message: "Producto eliminado con éxito",
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
}

export default CartManager;
