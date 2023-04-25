import express from "express";
import morgan from "morgan"; //morgan para debug
import __dirname from "./utils.js";
const app = express();

//handlebars
import handlebars from "express-handlebars";
import viewsRouter from './routes/views.routes.js'
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use('/', viewsRouter)



//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//rutas
import routes from "./index.js";
app.use("/", routes);

export default app;
