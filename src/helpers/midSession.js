export const requireLogin = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login'); // Redirige al usuario a la página de inicio de sesión si no tiene una sesión activa
    }
    next();
  };
  