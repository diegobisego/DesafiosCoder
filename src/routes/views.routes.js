import { Router } from "express";
import ProductManager from "./../manager/ProductManager.js";

const router = Router() 
const newProductManager = new ProductManager("src/db/products.json")

router.get("/", async (_req, res) => {

    const resultProducts = await newProductManager.getProducts() 
    const products = resultProducts.data

  res.render("home", {
    products
  });
});

export default router