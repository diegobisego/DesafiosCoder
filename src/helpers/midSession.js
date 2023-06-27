export const requireLogin = (req, res, next) => {
    if (!req.cookies.authToken) {
      return res.redirect('/login'); // Redirige al usuario a la página de inicio de sesión si no tiene una sesión activa
    }
    next();
  };
  
export const isLogin = (req,res,next) => {
    if (!req.cookies.authToken) next()
    else return res.redirect('/products')
}  