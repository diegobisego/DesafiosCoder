import express from "express";
import morgan from "morgan"; //morgan para debug
import routes from `${__dirname}/routes/index.js`
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//use de router
app.use('/', routes)


export default app;
