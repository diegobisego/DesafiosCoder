import { Router } from "express";
// import ProductManager from "./../dao/manager/ProductManager.js";
import ProductManager from "./../dao/manager/mongoProducts.js";
import { requireLogin } from "../helpers/midSession.js";

const router = Router();
// const newProductManager = new ProductManager("src/db/products.json")
const newProductManager = new ProductManager();

// register
router.get('/login', async (req,res) => {
  res.render('login')
})

// bienvenido
router.get('/welcome', (req,res) => {
  res.render('welcome', {
    user: req.session.user
  })
})

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

    // se genera la sesion, aca deberian venir los datos del user una vez 
    // validados que exista en mongo
    req.session.papa = {conqueso:true}

    const { limit, page, sort, query } = req.query;

    const products = await newProductManager.getProducts(limit, page, sort, query);
    
    res.render("products", { products});
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
