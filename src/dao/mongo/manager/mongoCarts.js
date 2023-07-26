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
  postProductInCart = async (cid, pid, quantity, finalPrice) => {
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

      let productIndex = -1;
      const productsInCart = cartFind.data.products;

      productIndex = productsInCart.findIndex(
        (product) => product.product._id.toString() === pid
      );

      // Si el producto ya existe en el carrito, aumenta la cantidad y el precio
      if (productIndex !== -1) {
        // Obtengo el producto existente del carrito
        const existingProduct = cartFind.data.products[productIndex];

        // Aumenta la cantidad del producto según la cantidad que se pasa por código o en 1 si no se proporciona
        const newQuantity = existingProduct.quantity + (quantity || 1);

        // Calcula el nuevo precio unitario del producto en el carrito
        const newUnitPrice = finalPrice / quantity;

        // Calcula el nuevo precio total del producto en el carrito
        const newPrice = newUnitPrice * newQuantity;

        // Actualiza la cantidad y el precio del producto en el carrito
        const cart = await CartModel.findOneAndUpdate(
          { _id: cid, "products._id": existingProduct._id }, // Filtro para encontrar el carrito y el producto específico
          {
            $set: {
              "products.$.quantity": newQuantity,
              "products.$.price": newPrice,
            },
          },
          { new: true }
        );

        return {
          success: true,
          message:
            "La cantidad y precio del producto se hn actualizado en el carrito",
          data: cart,
        };
      }

      const productInCart = {
        product: pid,
        quantity: quantity || 1,
        price: finalPrice, // Agregar el precio del producto al carrito
      };

      console.log("producto: ", productInCart);
      const cart = await CartModel.findByIdAndUpdate(
        cid,
        { $push: { products: productInCart } },
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

  // update quantity product in cart (quedo todo dentro de postProductInCart)
  // putProductInCart = async (cid, pid, quantity) => {
  //   try {
  //     const cart = await this.getCartById(cid);

  //     if (!cart.success) {
  //       return {
  //         success: false,
  //         message: "El carrito con el ID indicado no existe",
  //       };
  //     }

  //     const productIndex = cart.data.products.findIndex(
  //       (product) => product.product._id.toString() === pid
  //     );

  //     if (productIndex === -1) {
  //       return {
  //         success: false,
  //         message: "El producto no existe dentro del carrito",
  //       };
  //     }

  //     const updatedCart = await CartModel.updateOne(
  //       { _id: cid, "products.product": pid },
  //       { $inc: { "products.$.quantity": quantity } },
  //       { new: true }
  //     );

  //     if (!updatedCart) {
  //       return {
  //         success: false,
  //         message: "Error al actualizar el carrito",
  //       };
  //     }

  //     return {
  //       success: true,
  //       message: "Producto actualizado con éxito",
  //     };
  //   } catch (error) {
  //     console.log(error);
  //     return {
  //       success: false,
  //       message: `Error en manager: ${error}`,
  //     };
  //   }
  // };

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

  purchaseCart = async (cid) => {
    const result = await this.getCartById(cid);
    const cartProduts = result.data.products;

    const productsOutStock = []
    let totalPriceProducts = 0

    cartProduts.forEach((element) => {
      if (element.product.quantity < element.quantity) {
        productsOutStock.push({idProduct:element.product._id})
      }
      totalPriceProducts += element.price
    });

    console.log(productsOutStock)
    console.log(totalPriceProducts)


  };
}

export default CartManager;
