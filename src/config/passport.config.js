import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.js";
import UserManager from "./../dao/manager/mongoUsers.js";
import GithubStrategy from "passport-github2";
import CartManager from './../dao/manager/mongoCarts.js'
import { Strategy, ExtractJwt } from "passport-jwt";
import { cookieStractor } from "../helpers/passportCall.js";
import { createHash, validatePassword } from "../helpers/bcrypt.js";

const newUser = new UserManager();
const newCart = new CartManager();

const LocalStrategy = local.Strategy; //estategia local, user + pass

// inicializador de estrategias
export const inicializePassport = () => {
  //passport de register
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email", session: false },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age, role } = req.body; //desde body se pide todo menos usuario y pass

          const exist = await userModel.findOne({ email }); //verifico si exite el correo

          if (exist) {
            return done(null, false, { message: "El usuario ya existe" }); // donde quiere devolverte un usuario en req.user (null: es el error, false: no devuelvo el user)
          }


          // creo el carrito y traigo el id
          const cart = await newCart.addCart()
          const cartId = cart._id

          const hashedPassword = await createHash(password);

          const newUserRegisrer = {
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
            role,
            cartId
          };

          const result = await newUser.createUser(newUserRegisrer);

          if (result) {
            // si todo va bien, devuelvo el usuario
            return done(null, result.data, {
              message: result.message,
            });
          }

          done(null, false, { message: "Error en crear el usuario" }); // retorno error al crear el usuario por si falla en la peticion de mongo
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // passport login
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", session: false },
      async (email, password, done) => {
        //passport solo debe devolver al usuario final, no es responsable de la sesion
        try {
          if (
            email === "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            const user = {
              name: `Admin`,
              email: "adminCoder@coder.com",
              role: "Admin",
              id: 0,
            };

            return done(null, user);
          }

          const result = await newUser.loginUser(email, password);

          if (!result.success) {
            return done(null, false, { message: result.message });
          }

          //devuelvo los usuarios aca todo ok
          return done(null, result.data);
        } catch (error) {
          console.log(`Error en ruta login: ${error}`);
        }
      }
    )
  );

  // passport github
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.7033fac6a316272c", //quien es el cliente q esta utilizando esta estrategia
        clientSecret: "737d33aeefafdb2db25b1bd419526e7cc804645d", //clave generada en github
        callbackURL: "http://localhost:8080/api/session/githubcallback", // endpoint de session
        session: false,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          //tomo los datos que me sirven del profile, q son los datos q me manda github del perfil del usuario
          const { name, email } = JSON.stringify(profile._json);

          const user = await newUser.loginUser({ email }); // verifico si el usuario existe

          if (user) {
            // si existe lo devuelvo
            return done(null, user);
          }

          // si no existe
          const newUserGit = {
            name,
            email,
            password: "",
          };

          const result = await userModel.create(newUserGit);

          // devuelvo el user
          done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // verificacion token con passport
   passport.use(
    "jwt",
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieStractor]),
        secretOrKey: "jwtSecret",
      },
      async (payload, done) => {
        return done(null, payload);
      }
    )
  );

  // serializables, esto es copiar y pegar, es algo que tiene ya predefinido passport

  // se desactiva para trabajar con passport y jwt

  // passport.serializeUser(function (user, done) {
  //   return done(null, user.id); // Serializa el usuario por su id
  // });

  // passport.deserializeUser(async function (id, done) {
  //   try {
  //     if (id == 0) {
  //       return done(null, {
  //         role: "Admin",
  //         name: "Admin",
  //       });
  //     }
  //     const user = await userModel.findOne({ _id: id }); // Busca el usuario por su _id
  //     return done(null, user); // Devuelve el objeto de usuario completo
  //   } catch (error) {
  //     done(error);
  //   }
  // });
};
