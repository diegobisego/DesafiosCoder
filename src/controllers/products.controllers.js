import MongoProductManager from "../dao/manager/mongo/mongoProducts.js";
const ProductManager = new MongoProductManager();
import { body, validationResult } from "express-validator";

// obtiene un producto
const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductManager.getProductById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        messege: "No se encontro el producto solicitado",
      });
    }

    res.status(200).json({
      success: result.success,
      messege: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(
      `Se verifica un error al intentar obtener el producto: ${error}`
    );
  }
};

// obtiene todos los productos
const getAllProducts = async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    const result = await ProductManager.getProducts(limit, page, sort, query);

    res.status(200).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(
      `Se verifica un error al intentar obtener los productos: ${error}`
    );
  }
};

// agrega 1 producto a la bbdd
const postOneProduct = [
  body("title").notEmpty().withMessage("El campo title no puede estar vacío"),
  body("description")
    .notEmpty()
    .withMessage("El campo description no puede estar vacío"),
  body("code").notEmpty().withMessage("El campo code no puede estar vacío"),
  body("price").notEmpty().withMessage("El campo price no puede estar vacío"),
  body("category")
    .notEmpty()
    .withMessage("El campo category no puede estar vacío"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const { title, description, code, price, stock, category, thumbnails } =
        req.body;

      const result = await ProductManager.addProduct(
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
      );

      const arrayProductsMongo = await ProductManager.getProducts();
      req.io.emit("arrayProductsMongo", arrayProductsMongo);

      if (result.success) {
        res.status(201).json({
          success: true,
          message: result.message,
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Se produjo un error en la petición: ${error}`,
      });
    }
  },
];

// edita 1 producto
const putOneProduct = async (req, res) => {
  const { id } = req.params;
  const object = req.body;

  //actualizacion de producto
  const result = await ProductManager.updateProduct(id, object);

  //respuesta segun result
  if (result.success) {
    return res.status(200).json({
      success: result.success,
      message: result.message,
    });
  }

  return res.status(404).json({
    success: result.success,
    message: result.message,
  });
};

// eliminar un producto
const deleteOneProduct = async (req,res) => {
    const { id } = req.params;

  const result = await ProductManager.deleteProduct(id);

  //respuesta segun result
  if (result.success) {
    return res.status(200).json({
      success: result.success,
      message: result.message,
    });
  }

  return res.status(404).json({
    success: result.success,
    message: result.message,
  });
}

export default {
  getOneProduct,
  getAllProducts,
  postOneProduct,
  putOneProduct,
  deleteOneProduct
};
