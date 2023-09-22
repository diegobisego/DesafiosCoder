import { CartService } from "../services/index.js";

// obtener todos los carritos
const getAllCarts = async (_req, res) => {
  try {
    const result = await CartService.getAllCarts();

    if (result.success) {
      return res.status(200).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    }

    res.status(404).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Se produjo un error en la petición: ${error}`,
    });
  }
};

// obtener 1 carrito
const getOneCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const result = await CartService.getOneCart(cid);

    res.status(result.status).json({
      success: result.success,
      messege: result.message,
      data: result.data,
    });
  } catch (error) {
    const logger = req.logger;
    res.status(500).json({
      success: false,
      message: logger.error(`Se produjo un error en editar producto: ${error}`),
    });
  }
};

// crear un carrito
const postCart = async (_req, res) => {
  try {
    const result = await CartService.postCart();

    console.log('resultado: ', result.data._id )

    if (result.success) {
      return res.status(201).json({
        success: result.success,
        message: result.message,
        payload: result.data._id
      });
    }

    res.status(404).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    const logger = req.logger;
    res.status(500).json({
      success: false,
      message: logger.error(`Se produjo un error en editar producto: ${error}`),
    });
  }
};

// agregar producto a 1 carrito
const postProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity, finalPrice } = req.body;

    const result = await CartService.postProductInCart(
      cid,
      pid,
      quantity,
      finalPrice
    );

    if (result.success) {
      return res.status(201).json({
        success: result.success,
        message: result.message,
        payload: result.data,
      });
    }

    res.status(404).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    const logger = req.logger;
    res.status(500).json({
      success: false,
      message: logger.error(`Se produjo un error en editar producto: ${error}`),
    });
  }
};

// editar producto a 1 carrito
// const putProductInCart = async (req, res) => {
//   try {
//     const { cid, pid } = req.params;
//     const { quantity } = req.body;

//     const result = await CartService.putProductInCart(cid, pid, quantity);

//     if (result.success) {
//       return res.status(200).json({
//         success: result.success,
//         message: result.message,
//         data: result.data,
//       });
//     }

//     res.status(404).json({
//       success: result.success,
//       message: result.message,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: `Se produjo un error en la petición: ${error}`,
//     });
//   }
// };

// borra 1 carrito
const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const result = await CartService.deleteCart(cid);

    if (result.success) {
      return res.status(204).send();
    }

    res.status(404).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    const logger = req.logger;
    res.status(500).json({
      success: false,
      message: logger.error(`Se produjo un error en editar producto: ${error}`),
    });
  }
};

// borra 1 producto de 1 carrito
const deleteProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = await CartService.deleteProductInCart(cid, pid);

    if (result.success) {
      return res.status(200).json({
        success: result.success,
        message: result.message,
      });
    }

    res.status(404).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    const logger = req.logger;
    res.status(500).json({
      success: false,
      message: logger.error(`Se produjo un error en editar producto: ${error}`),
    });
  }
};

// ruta para comprar el carrito
const purchaseCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const emailDestination = req.body

    const result = await CartService.purchaseCart(cartId, emailDestination);

    if (result.success) {
      return res.status(200).json({
        success: result.success,
        message: result.message,
      });
    }

    res.status(404).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    const logger = req.logger;
    res.status(500).json({
      success: false,
      message: logger.error(`Se produjo un error en editar producto: ${error}`),
    });
  }
};

export default {
  getAllCarts,
  getOneCart,
  postCart,
  postProductInCart,
  // putProductInCart,
  deleteCart,
  deleteProductInCart,
  purchaseCart,
};
