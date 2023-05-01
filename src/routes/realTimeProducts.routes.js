import { Router } from "express";
const router = Router();

import ProductManager from "./../manager/ProductManager.js";
const products = new ProductManager("src/db/products.json");

router.get("/", async (req, _res) => {
  try {
    const arrayProducts = await products.getProducts();
    req.io.emit("arrayProducts", arrayProducts);
  } catch (error) {
    console.error(`error al obtener productos: ${error}`);
  }
});

export default router;
