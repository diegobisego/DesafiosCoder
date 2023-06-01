import express from "express";
import morgan from "morgan"; //morgan para debug
import __dirname from "./dirname.js";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();



//mongod
const MONGOURI = process.env.MONGO_URI;
const connection = mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "ecommerce",
});

//handlebars
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use("/", viewsRouter);

//socket.io
import { Server } from "socket.io";
import registerChatHandler from "./listeners/chatHandler.js";

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = new Server(server);

app.use((req, res, next) => {
  //La intención será REFERENCIAR NUESTRO io
  req.io = io;
  next();
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(`${__dirname}/public`));

//rutas
import routes from "./index.js";
app.use("/", routes)



//socket chat
io.on("connection", (socket) => {
  console.log("Socket conectado");
  registerChatHandler(io, socket);
});
