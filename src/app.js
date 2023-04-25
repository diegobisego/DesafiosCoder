import express from "express";
import morgan from "morgan"; //morgan para debug
import __dirname from "./utils.js";
const app = express();

//handlebars
import handlebars from "express-handlebars";
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

import ProductManager from "./manager/ProductManager.js";
const newProductManager = new ProductManager("src/db/products.json")

app.get("/", async (_req, res) => {

    const resultProducts = await newProductManager.getProducts() 
    const products = resultProducts.data

  res.render("home", {
    products
  });
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//rutas
import routes from "./index.js";
app.use("/", routes);

export default app;
