import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.js";
import UserManager from "./../dao/manager/mongoUsers.js";
import GithubStrategy from "passport-github2";
import { Strategy, ExtractJwt } from "passport-jwt";
import { cookieStractor } from "../helpers/passportCall.js";


const newUser = new UserManager();

const LocalStrategy = local.Strategy; //estategia local, user + pass

// inicializador de estrategias
export const inicializePassport = () => {
  //passport de register
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { name, lastName, role } = req.body; //desde body se pide todo menos usuario y pass

          const exist = await userModel.findOne({ email }); //verifico si exite el correo

          if (exist) {
            return done(null, false, { message: "El usuario ya existe" }); // donde quiere devolverte un usuario en req.user (null: es el error, false: no devuelvo el user)
          }

          const result = await newUser.createUser(
            name,
            lastName,
            email,
            password,
            role
          );

          if (result) {
            
            // si todo va bien, devuelvo el usuario
            return done(null, result.data, {
              message: "Usuario creado con exito",
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
      { usernameField: "email" },
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

          if (result.success) {
            //no creo la sesion, devuelvo los usuarios
            const user = {
              name: `${result.data.name} ${result.data.lastname}`,
              email: result.data.email,
              role: result.data.role,
              id: result.data._id,
            };
            //aca todo ok
            return done(null, user);
          }

          done(null, false, { message: "Credenciales incorrecta" });
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
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          //tomo los datos que me sirven del profile, q son los datos q me manda github del perfil del usuario
          const { name, email } = profile._json;

          const user = await userModel.findOne({ email }); // verifico si el usuario existe

          if (user) {
            // si existe lo devuelvo
            return done(null, user);
          }

          // si no existe
          const newUser = {
            name,
            email,
            password: "",
          };

          const result = await userModel.create(newUser);

          // devuelvo el user
          done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );


  // verificacion token con passport
  passport.use('jwt', new Strategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieStractor]),
    secretOrKey: 'jwtSecret'
  }, async(payload, done)=> {
    return done(null, payload)
  }))
  
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
