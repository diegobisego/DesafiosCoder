import { ProductService } from "../services/index.js";
import { moksGenerateProducts } from "../moks/products.moks.js";
import { body, validationResult } from "express-validator";

// obtiene un producto
const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductService.getOneProduct(id);

    res.status(result.status).json({
      success: result.success,
      messege: result.message,
      data: result.data,
    });
  } catch (error) {
    const logger = req.logger;
    logger.error(`Se produjo el siguiente error: ${error}`);
  }
};

// obtiene todos los productos
const getAllProducts = async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    const result = await ProductService.getAllProducts(
      limit,
      page,
      sort,
      query
    );

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
      const owner = req.user.email;
      const {
        title,
        description,
        code,
        price,
        quantity,
        category,
        thumbnails,
      } = req.body;

      const result = await ProductService.postOneProduct(
        title,
        description,
        code,
        price,
        quantity,
        category,
        thumbnails,
        owner
      );

      const arrayProductsMongo = await ProductService.getAllProducts();
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
  try {
    const { id } = req.params;
    const product = req.body;

    //actualizacion de producto
    const result = await ProductService.putOneProduct(id, product);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Se produjo un error en la petición: ${error}`,
    });
  }
};

// eliminar un producto
const deleteOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // verifico si el rol es premium
    const findProduct = await ProductService.findProduct(id);
    const userRole = req.user.role;

    if (findProduct.owner === "premium" && userRole === "premium") {
      const result = await ProductService.deleteOneProduct(id);
      if (result.success) {
        return res.status(200).json({
          success: result.success,
          message: result.message,
        });
      }
    }

    if (userRole === "Admin") {
      // si no es premium es admin por defecto
      const result = await ProductService.deleteOneProduct(id);

      //respuesta segun result
      if (result.success) {
        return res.status(200).json({
          success: result.success,
          message: result.message,
        });
      }
    }

    return res.status(404).json({
      success: 'False',
      message: 'Usuario incorrecto',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Se produjo un error en la petición: ${error}`,
    });
  }
};

// Mock products faker
const moksProducts = async (_req, res) => {
  const dataMok = await moksGenerateProducts();
  res.send(dataMok);
};

export default {
  getOneProduct,
  getAllProducts,
  postOneProduct,
  putOneProduct,
  deleteOneProduct,
  moksProducts,
};
