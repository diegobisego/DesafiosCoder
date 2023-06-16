import { Router } from "express";
import passport from "passport";

const router = Router();

//ruta con passport para register
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/session/registerFail",
  }),
  async (_req, res) => {
    res.status(201).json({
      success: true,
      message: 'Usuario creado con exito'
    });
  }
);

//ruta si falla register
router.get("/registerFail", (req, res) => {
  res.status(400).json({
    success: false,
    message: req.session.message,
  });
});


// ruta login con passport
router.post("/login", passport.authenticate('login', {failureRedirect:'/api/sessions/loginFail'}) ,async (req, res) => {
  req.session.User = {
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    id: req.user.id
  }

  console.log('aca el req session: ' + JSON.stringify(req.session.User))
  return res.status(200).json({
    success: true,
    message: 'Usuario encontrado con exito'
  })
});

router.get('/loginFail', (req,res) => {
    res.status(400).json({
      success: false,
      message: req.session.message
    })
})

// Ruta para destruir la sesión
router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error al destruir la sesión:", error);
      return res.status(500).json({ message: "Error al destruir la sesión" });
    }
    res.clearCookie("connect.sid"); // Elimina la cookie de sesión en el cliente
    res
      .status(200)
      .json({ success: true, message: "Sesión destruida exitosamente" });
  });
});

export default router;
