import { authorizeRoles } from "../helpers/checkAdmin.js";
import { Router } from "express";
const router = Router();
import productsController from './../controllers/products.controllers.js'


// ruta obtener 1 producto
router.get("/:id",  productsController.getOneProduct);

// ruta obtener productos
router.get("/", productsController.getAllProducts);

// ruta agregar un productos
router.post("/", authorizeRoles(['Admin']), productsController.postOneProduct);

// ruta editar un producto
router.put("/:id", authorizeRoles(['Admin']), productsController.putOneProduct);

// ruta eliminar 1 producto
router.delete("/:id", authorizeRoles(['Admin']), productsController.deleteOneProduct);

export default router;
