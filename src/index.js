//requiero Router
import { Router } from 'express';
const router = Router();

//importacion de rutas
import healthRouter from './routes/health.routes.js' 
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js' 
import realTimeProductsRouter from './routes/realTimeProducts.routes.js'
import mongoProducts from './routes/mongoProducts.routes.js' 
import mongoCarts from './routes/mongoCarts.routes.js' 
import sessions from './routes/sessions.routes.js' 
import mailAndSMS from './routes/mailAndSMS.routes.js'
import moksRouter from './routes/moks.routes.js'


//use de rutas
router.use('/api/health', healthRouter)
      .use('/api/fs/products', productsRouter)
      .use('/api/fs/carts', cartsRouter )
      .use('/realTimeProducts', realTimeProductsRouter)
      .use('/api/products', mongoProducts)
      .use('/api/carts', mongoCarts)
      .use('/api/session', sessions)
      .use('/api', mailAndSMS)
      .use('/mockingproducts', moksRouter)

      

export default router