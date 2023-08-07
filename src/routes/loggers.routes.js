import { Router } from "express";
const router = Router();

router.get('/', (req,res) => {
    const logger = req.logger;

    logger.debug('debug');
    logger.http('http');
    logger.info('info');
    logger.warning('warning');
    logger.error('error');
    logger.fatal('fatal');

    res.send('ok')
});

export default router;
    
