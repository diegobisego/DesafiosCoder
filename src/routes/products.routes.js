import { Router } from 'express'
const router = Router()
import ProductManager from "./Manager/ProductManager.js";

const products = new ProductManager("src/db/products.json");

// alive
router.get("/health", (_req, res) => {
  res.status(200).send({
    success: true,
    messege: "UP",
  });
});

// obtener productos
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    let data = await products.getProducts();

    if (limit) {
      data = data.slice(0, limit);
    }

    res.status(200).json({
      success: true,
      messege: "Productos encontrados con exito",
      data: data,
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
    const data = await products.getProductById(pid);

    if (!data) {
      return res.status(404).json({
        success: false,
        messege: "No se encontro el producto solicitado",
      });
    }

    res.status(200).json({
      success: true,
      messege: "Se encontro el producto solicitado",
      data,
    });
  } catch (error) {
    console.error(
      `Se verifica un error al intentar obtener el producto: ${error}`
    );
  }
});

export default router