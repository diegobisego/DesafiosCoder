//requiero Router
import { Router } from 'express';
const router = Router();
;


//importacion de rutas
import healthRouter from './routes/health.routes.js' 
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js' 
import realTimeProductsRouter from './routes/realTimeProducts.routes.js'
import mongoProducts from './routes/mongoProducts.routes.js' 



//use de rutas
router.use('/api/health', healthRouter)
      .use('/api/products', productsRouter)
      .use('/api/carts', cartsRouter )
      .use('/realTimeProducts', realTimeProductsRouter)
      .use('/api/mongo/products', mongoProducts)
      

export default router