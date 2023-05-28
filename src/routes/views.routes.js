import { Router } from "express";
// import ProductManager from "./../dao/manager/ProductManager.js";
import ProductManager from "./../dao/manager/mongoProducts.js";

const router = Router();
// const newProductManager = new ProductManager("src/db/products.json")
const newProductManager = new ProductManager();

// home de products con fs
router.get("/", async (_req, res) => {
  const resultProducts = await newProductManager.getProducts();
  const products = resultProducts.data;

  res.render("home", {
    products,
  });
});

// products con mongo
router.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    const result = await newProductManager.getProducts(limit, page, sort, query);
    console.log(result)
    const products = result.data;

    const prevLink = result.prevLink
    const nextLink = result.nextLink
    const hasPrevPage = result.hasPrevPage
    const hasNextPage = result.hasNextPage
    
    res.render("products", { products,prevLink,nextLink,hasPrevPage,hasNextPage });
  } catch (error) {
    res.render(`Se produjo un error en la obtencion de productos: ${error}`);
  }
});

// realtime products
router.get("/", async (_req, res) => {
  res.render("realTimeProducts");
});

// chat
router.get("/chat", async (_req, res) => {
  res.render("chat");
});

export default router;
