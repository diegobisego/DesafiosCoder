import { Router } from "express";
import productsController from './../controllers/products.controllers.js'
const router = Router();



// ruta mocks products
router.get('/', productsController.moksProducts)

export default router