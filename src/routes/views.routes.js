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

router.get('/', async (_req,res) => {
  res.render('realTimeProducts')
})

router.get('/chat', async (_req,res) => {
  res.render('chat')
})



export default router