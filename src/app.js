import express from "express";
import morgan from "morgan"; //morgan para debug
import ProductManager from "./Manager/ProductManager.js";
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const products = new ProductManager("src/db/products.json");

// alive
app.get("/health", (req, res) => {
  res.status(200).send({
    success: true,
    messege: "UP",
  });
});

// rutas

// obtener productos
app.get("/products/:limit", async (req, res) => {
  try {
    const limit = req.params.limit;
    const data = await products.getProducts();

    const arrayProducts = [];

    for (let i = 0; i < limit; i++) {
      arrayProducts.push(data[i]);
    }

    res.status(200).send({
      success: true,
      messege: "Productos encontrados con exito",
      data: arrayProducts,
    });
  } catch (error) {
    console.error(
      `Se verifica un error al intentar obtener los productos: ${error}`
    );
  }
});

//

export default app;
