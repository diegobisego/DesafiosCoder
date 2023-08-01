import { authorizeRoles } from "../helpers/checkAdmin.js";
import { Router } from "express";
const router = Router();
import { passportCall } from "../helpers/passportCall.js";
import productsController from './../controllers/products.controllers.js'



// ruta obtener 1 producto
router.get("/:id",  productsController.getOneProduct);

// ruta obtener productos
router.get("/", productsController.getAllProducts);

// ruta agregar un productos
router.post("/", passportCall('jwt'),authorizeRoles(['Admin']), productsController.postOneProduct);

// ruta editar un producto
router.put("/:id", passportCall('jwt'),authorizeRoles(['Admin']), productsController.putOneProduct);

// ruta eliminar 1 producto
router.delete("/:id", passportCall('jwt'),authorizeRoles(['Admin']), productsController.deleteOneProduct);

// ruta mocks products
router.get('/mockingproducts', productsController.moksGenerateProducts)

export default router;
