import MongoProductManager from "../manager/mongoProducts.js";
import { Router } from "express";
import { body, validationResult } from "express-validator";
const router = Router();


const ProductManager = new MongoProductManager()

// obtener productos
router.get("/", async (_req, res) => {
  try {
    

    const {success,message,data} = await ProductManager.getProducts()
    res.status(200).json({
      success,
      message,
      data
    })

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
    const result = await ProductManager.getProductById(pid);

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

// agregar un productos
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("El campo title no puede estar vacío"),
    body("description")
      .notEmpty()
      .withMessage("El campo description no puede estar vacío"),
    // body("code").notEmpty().withMessage("El campo code no puede estar vacío"),
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

      const result = await ProductManager.addProduct(
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
      );

      const arrayProductsMongo = await ProductManager.getProducts()
      req.io.emit("arrayProductsMongo", arrayProductsMongo)

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

// editar un producto
router.put("/:pcode", async (req, res) => {
  //parametro y body
  const { pcode } = req.params;
  const object = req.body;

  //actualizacion de producto
  const result = await ProductManager.updateProduct(pcode, object);

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
});

// delete de productos
router.delete("/:pcode", async (req, res) => {
  const { pcode } = req.params;

  const result = await ProductManager.deleteProduct(pcode);

  // const arrayProducts = await products.getProducts()
  // req.io.emit("arrayProducts", arrayProducts)

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
});

export default router;
