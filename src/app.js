import express from "express";
import morgan from "morgan"; //morgan para debug
import __dirname from "./dirname.js";
const app = express();
import mongoose from "mongoose";
import { inicializePassport } from "./config/passport.config.js";
import config from './config/config.js'
import cors from 'cors'

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(`${__dirname}/public`));
app.use(cors())

// cookies
import cookieParser from "cookie-parser";
app.use(cookieParser()); 


// mongo
const MONGOURI = config.mongo.MONGO_URI;
const connection = mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "ecommerce",
});

//passport
inicializePassport()



//handlebars
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
import sessionRouter from "./routes/sessions.routes.js";
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use("/", viewsRouter);
app.use("/", sessionRouter);

//socket.io
import { Server } from "socket.io";
import registerChatHandler from "./listeners/chatHandler.js";

const PORT = config.app.PORT
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = new Server(server);

app.use((req, res, next) => {
  //La intención será REFERENCIAR NUESTRO io
  req.io = io;
  next();
});


//rutas
import routes from "./index.js";
app.use("/", routes);

//socket chat
io.on("connection", (socket) => {
  console.log("Socket conectado");
  registerChatHandler(io, socket);
});
