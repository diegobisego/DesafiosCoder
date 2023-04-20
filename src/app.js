import express from "express";
import morgan from "morgan"; //morgan para debug
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//rutas
import routes from './index.js'
app.use('/', routes)

export default app;
