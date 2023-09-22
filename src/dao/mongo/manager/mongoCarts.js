import ProductModel from "./../models/products.js";
import userModel from "../models/user.js";
import CartModel from "./../models/carts.js";
import TicketModel from "../models/ticket.js";
import { findClientByCartId } from "../../../helpers/findUserInCart.js";
import { generateTicketCode, calculateTotalAmount } from "../../../helpers/tickets.js";
import ErrorFactory from "../../../services/repositories/errorRepository.js";
import { cartsErrorCartNotFound } from "../../../constants/productsError.js";
import { EErrors } from "../../../constants/EErrors.js";
import { config } from "dotenv";

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
          status: 200,
        };
      }

      // Uso de errores
      ErrorFactory.createError({
        name: "Cart not found",
        cause: cartsErrorCartNotFound(cid),
        message: "Id cart incorrect",
        code: EErrors.CART,
        status: 404,
        success: false,
        data: "Empty",
      });

    } catch (error) {
      return error
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

  purchaseCart = async (cid, emailDestination) => {
    try {
      // Obtener el carrito y sus productos
      const cart = await CartModel.findById(cid).populate('products');
  
      // Verificar si el carrito existe
      if (!cart) {
        return {
          success: false,
          message: 'Carrito no encontrado',
        };
      }
  
      // Array para almacenar los productos con stock
      const productsWithEnoughStock = [];
      const productsNotProcessed = [];
  
      // Procesar cada producto del carrito
      for (const cartProduct of cart.products) {
        const productId = cartProduct.product;
        const quantityToPurchase = cartProduct.quantity;
  
        // Verificar si el producto existe en la base de datos
        const product = await ProductModel.findById(productId);
  
        if (!product) {
          return {
            success: false,
            message: 'Producto no encontrado',
          };
        }
  
        // Verificar si hay suficiente stock para la compra
        if (product.quantity >= quantityToPurchase) {
          // Restar la cantidad del producto del stock
          await ProductModel.updateOne(
            { _id: productId },
            { $inc: { quantity: -quantityToPurchase } }
          );
          productsWithEnoughStock.push(cartProduct);
        } else {
          // Si no hay suficiente stock, eliminar el producto del carrito
          productsNotProcessed.push(productId);
        }
      }
  
      // Actualizar el carrito con los productos con stock
      cart.products = productsWithEnoughStock;
  
      // Filtrar los productos no procesados en el carrito
      const productsNotProcessedIds = productsNotProcessed.map((productId) =>
        productId.toString()
      );
  
      cart.products = cart.products.filter(
        (p) => !productsNotProcessedIds.includes(p.product.toString())
      );
  
      // Buscar el id del cliente correspondiente al cart
      const idClient = await findClientByCartId(cid);
  
      // Crear un nuevo ticket si la compra se completó con éxito
      let ticketData = null;
      if (productsNotProcessed.length === 0) {
        // Guardar información de la compra
        ticketData = {
          code: generateTicketCode(), // Genera el código del ticket
          purchase_datetime: new Date(),
          amount: calculateTotalAmount(cart.products), // Calcula el monto total del carrito
          purchaser: idClient, // ID del comprador (ajusta según tu modelo)
        };
  
        // Crear el ticket
        await TicketModel.create(ticketData);
  
        // Configura el transporter de Nodemailer (ajusta según tu proveedor de correo)
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: config.email.APP_MAIL, // Reemplaza con tu dirección de correo
            pass: config.email.APP_PASSWORD, // Reemplaza con tu contraseña
          },
        });
  
        // Contenido del correo electrónico
        const mailOptions = {
          from: config.email.APP_MAIL,
          to: emailDestination, // Reemplaza con la dirección del destinatario
          subject: 'Compra realizada con éxito',
          text: `Gracias por tu compra. Adjunto encontrarás tu ticket de compra.`,
          attachments: [
            {
              filename: 'ticket.pdf', // Nombre del archivo adjunto
              path: 'ruta_del_archivo.pdf', // Ruta al archivo PDF del ticket
            },
          ],
        };
  
        // Envía el correo electrónico
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error al enviar el correo electrónico:', error);
          } else {
            console.log('Correo electrónico enviado:', info.response);
          }
        });
      }
  
      // Guardar los productos sin stock en el carrito
      await CartModel.updateOne(
        { _id: cid },
        { $set: { products: productsWithEnoughStock } }
      );
  
      return {
        success: true,
        message: 'Proceso de compra finalizado exitosamente',
        ticket: ticketData,
      };
    } catch (error) {
      console.log('Error en el proceso de compra:', error);
      return { success: false, message: 'Error en el servidor' };
    }
  };
  
  
}

export default CartManager;
