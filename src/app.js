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
app.get("/products/:limit?", async (req, res) => {
  try {
    const limit = req.params.limit;
    let data = await products.getProducts();

    if (limit) {
        data = data.slice(0, limit);
    }
    
    res.status(200).send({
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

// 

export default app;
