import express from "express";
import morgan from "morgan"; //morgan para debug
import ProductManager from "./manager/ProductManager.js";
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const products = new ProductManager("src/db/products.json");

// alive
app.get("/health", (_req, res) => {
  res.status(200).send({
    success: true,
    messege: "UP",
  });
});

// obtener productos
app.get("/products", async (req, res) => {
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
app.get("/products/:pid", async (req, res) => {
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



export default app;
