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

// crear un carrito
const postCart = async (_req, res) => {
  try {
    const result = await CartService.postCart();

    if (result.success) {
      return res.status(201).json({
        success: result.success,
        message: result.message,
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

// agregar producto a 1 carrito
const postProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = await CartService.postProductInCart(cid, pid);

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
    res.status(500).json({
      success: false,
      message: `Se produjo un error en la petición: ${error}`,
    });
  }
};

// editar producto a 1 carrito
const putProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const result = await CartService.putProductInCart(cid, pid, quantity);

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
    res.status(500).json({
      success: false,
      message: `Se produjo un error en la petición: ${error}`,
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
    res.status(500).json({
      success: false,
      message: `Se produjo un error en la petición: ${error}`,
    });
  }
};

export default {
  getAllCarts,
  getOneCart,
  postCart,
  postProductInCart,
  putProductInCart,
  deleteCart,
  deleteProductInCart,
};
