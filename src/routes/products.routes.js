import ProductManager from "./../manager/ProductManager.js";
import { Router } from "express";
import { body, validationResult } from "express-validator";
const router = Router();

const products = new ProductManager("src/db/products.json");

// obtener productos
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    let result = await products.getProducts();

    if (limit) {
      result = result.slice(0, limit);
    }

    if (result.success) {
      return res.status(200).json({
        success: result.success,
        messege: result.message,
        data: result.data,
      });
    }
    res.status(404).json({
      success: result.success,
      messege: result.message
    });

  } catch (error) {
    console.error(
      `Se verifica un error al intentar obtener los productos: ${error}`
    );
  }
});

// obtener 1 producto
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await products.getProductById(pid);

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
});

//agregar un productos
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("El campo title no puede estar vacío"),
    body("description")
      .notEmpty()
      .withMessage("El campo description no puede estar vacío"),
    body("code").notEmpty().withMessage("El campo code no puede estar vacío"),
    body("price").notEmpty().withMessage("El campo price no puede estar vacío"),
    body("category")
      .notEmpty()
      .withMessage("El campo category no puede estar vacío"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const { title, description, code, price, stock, category, thumbnails } =
        req.body;

      const result = await products.addProduct(
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
      );

      req.io.emit('products',meetings);

      if (result.success) {
        res.status(201).json({
          success: true,
          messege: result.message,
        });
      } else {
        res.status(404).json({
          success: false,
          messege: result.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        messege: `Se produjo un error en la peticion: ${error}`,
      });
    }
  }
);

//editar un producto
router.put("/:pid", async (req, res) => {
  //parametro y body
  const { pid } = req.params;
  const object = req.body;

  //actualizacion de producto
  const result = await products.updateProduct(pid, object);

  //respuesta segun result
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  }

  return res.status(404).json({
    success: false,
    message: result.message,
  });
});

//delete de productos
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  const result = await products.deleteProduct(pid);

  //respuesta segun result
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  }

  return res.status(404).json({
    success: false,
    message: result.message,
  });
});

export default router;
