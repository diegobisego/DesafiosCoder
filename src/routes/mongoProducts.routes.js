import { authorizeRolesAdminPremium } from "../helpers/authorizeRoles.js";
import { Router } from "express";
const router = Router();
import { passportCall } from "../helpers/passportCall.js";
import productsController from './../controllers/products.controllers.js'


// ruta obtener productos
router.get("/", productsController.getAllProducts);

// ruta obtener 1 producto
router.get("/:id",  productsController.getOneProduct);


// ruta agregar un productos
router.post("/", passportCall('jwt'),authorizeRolesAdminPremium(), productsController.postOneProduct);

// ruta editar un producto
router.put("/:id", passportCall('jwt'),authorizeRolesAdminPremium(), productsController.putOneProduct);

// ruta eliminar 1 producto
router.delete("/:id", passportCall('jwt'),authorizeRolesAdminPremium(), productsController.deleteOneProduct);



export default router;
