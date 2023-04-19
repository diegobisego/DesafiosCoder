//requiero Router
import { Router } from 'express';
const router = Router();
import __dirname from './utils.js';


//importacion de rutas
import productsRouter from `${__dirname}/routes/products.routes.js` 
import cartsRouter from `${__dirname}/routes/carts.routes.js` 


router.use('/api/products', productsRouter)
      .use('/api/carts', cartsRouter )

export default router