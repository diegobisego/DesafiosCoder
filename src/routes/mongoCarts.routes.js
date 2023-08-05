import { authorizeRoles } from "../helpers/checkAdmin.js";
import { Router } from "express";
import cartsControllers from "../controllers/carts.controllers.js";
import { passportCall } from "../helpers/passportCall.js";
const router = Router();

// ruta obtener carritos
router.get("/", cartsControllers.getAllCarts);

// ruta obtener 1 carrito
router.get("/:cid", cartsControllers.getOneCart);

// ruta crear 1 carrito
router.post("/", cartsControllers.postCart);

// ruta agregar producto a 1 carrito
router.post(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorizeRoles(["Usuario"]),
  cartsControllers.postProductInCart
);
 
// ruta que modifica el quantity de un producto en 1 carrito
// router.put("/:cid/products/:pid", cartsControllers.putProductInCart);

// ruta borrar 1 carrito
router.delete("/:cid", cartsControllers.deleteCart);

// ruta borrar 1 producto de 1 carrito
router.delete("/:cid/product/:pid", cartsControllers.deleteProductInCart);

// ruta para para el purchase
router.get("/:cid/purchase", cartsControllers.purchaseCart);

export default router;
