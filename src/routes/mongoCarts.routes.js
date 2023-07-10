
import { Router } from "express";
import cartsControllers from "../controllers/carts.controllers.js";
const router = Router();


// ruta obtener carritos
router.get("/", cartsControllers.getAllCarts);

// ruta obtener 1 carrito
router.get("/:cid", cartsControllers.getOneCart);

// ruta crear 1 carrito
router.post("/", cartsControllers.postCart);

// ruta agregar producto a 1 carrito
router.post("/:cid/product/:pid",cartsControllers.postProductInCart);

// ruta cambiar la cantidad de un producto en 1 carrito
router.put("/:cid/products/:pid", cartsControllers.putProductInCart);

// ruta borrar 1 carrito
router.delete("/:cid", cartsControllers.deleteCart);

// ruta borrar 1 producto de 1 carrito
router.delete("/:cid/product/:pid", cartsControllers.deleteProductInCart);


export default router;
