import express from "express";
import morgan from "morgan"; //morgan para debug
import __dirname from "./dirname.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
import sessionRouter from "./routes/sessions.routes.js";
import { Server } from "socket.io";
import registerChatHandler from "./listeners/chatHandler.js";
import routes from "./index.js";

dotenv.config();
const app = express();

// // cookies

app.use(cookieParser());

// sessions
// app.use(session({
//   secret:'cursoCoder@', // palabra secreta para intercambiar informacion
//   resave: false, // mantiene la sesion activa
//   saveUninitialized: false // permite guardar cualquier objeto de session asi este vacia
// }))

app.use(
  session({
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URI,
      ttl: 15,
    }),
    secret: "cursoCoder@", // palabra secreta para intercambiar informacion
    resave: false, // mantiene la sesion activa
    saveUninitialized: false, // permite guardar cualquier objeto de session asi este vacia
  })
);

//mongod

const MONGOURI = process.env.MONGO_URI;
const connection = mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "ecommerce",
});

//handlebars

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use("/", viewsRouter);
app.use("/", sessionRouter);

//socket.io

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

app.use("/", routes);

//socket chat
io.on("connection", (socket) => {
  console.log("Socket conectado");
  registerChatHandler(io, socket);
});
