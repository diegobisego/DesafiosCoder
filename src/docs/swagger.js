import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "../dirname.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion para swagger",
      description: "Documentacion de la descripcion",
    },
  },
  apis: [`${__dirname}/**/*.yaml`]
};


export const specs = swaggerJSDoc(swaggerOptions)