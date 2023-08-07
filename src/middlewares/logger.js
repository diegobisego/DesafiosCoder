import LoggerFactory from "../services/repositories/loggerRepository.js";

const loggerFactory = new LoggerFactory('prod');
const logger = loggerFactory.logger;

export const attachLogger = (req, res, next) => {
    req.logger = logger;
    next();
};




