import { Router } from "express";
import passport from "passport";
import { passportCall} from "../helpers/passportCall.js";
import userController from './../controllers/users.controllers.js'

const router = Router();

// ruta con passport para register
router.post("/register", passportCall('register'), userController.registerUser);

// ruta login con passport, cookies y token
router.post("/login", passportCall('login'), userController.loginUser);

// ruta para destruir la sesión
router.post("/logout", userController.logoutUser);

// ******** GITHUB authenticate ********

// trigger
router.get("/github", passport.authenticate("github"), (_req, _res) => {});

//autenticacion con terceros - github
router.get("/githubcallback",passport.authenticate("github"),userController.loginWithGitHub);

// ruta current para obtener el user y el token asociado
router.get('/current', passportCall('jwt'), userController.currentJWT);

// ruta para recuperar password
router.post('/restoreEmail', userController.restoreEmail)

// ruta donde redirecciona restore password
router.post('/restorePassword', userController.restorePassword)



export default router;
