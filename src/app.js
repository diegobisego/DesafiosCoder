import express from 'express'
import morgan from 'morgan'; //morgan para debug
const app = express()

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

export default app

