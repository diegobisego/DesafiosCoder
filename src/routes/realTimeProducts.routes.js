import { Router } from "express";
const router = Router();

import ProductManager from "../dao/fileSystem/manager/ProductManager.js";
const products = new ProductManager("src/db/products.json");

router.get("/", async (req, res) => {
  
  try {

    const arrayProducts = await products.getProducts();

    req.io.on("connection", socket=> {
      socket.emit("arrayProducts", arrayProducts);
    });
    
    res.render('realTimeProducts')

  } catch (error) {

    console.error(`error al obtener productos: ${error}`);
  }
  
});

export default router;
