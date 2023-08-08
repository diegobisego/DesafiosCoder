import winston from "winston";

export default class LoggerFactory {
  constructor(env) {
    this.options = {
      debug: 5,
      http: 4,
      info: 3,
      warning: 2,
      error: 1,
      fatal: 0,
    };
    this.levels = {
      debug: this.options.debug,
      http: this.options.http,
      info: this.options.info,
      warning: this.options.warning,
      error: this.options.error,
      fatal: this.options.fatal,
    };
    this.logger = this.createLogger(env);
  }

  createLogger = (env) => {
    switch (env) {
      case "dev":
        return winston.createLogger({
          levels: this.levels,
          transports: [new winston.transports.Console({ level: "debug" })],
          format: winston.format.simple(),
        });

      case "prod":

        return winston.createLogger({
          levels: this.levels,
          transports: [
            new winston.transports.Console({ level: "info" }),
            new winston.transports.File({
              level: "error",
              filename: '/src/logs/errors.log',
              format: winston.format.simple(),
            }),
          ],
        });
    }
  };
}
