// Middleware para autorización y delimitar el acceso
export function authorizeRoles(roles) {
    return (req, res, next) => {
      console.log(req)
      const user = req.user;

      // Verificar si el usuario tiene un rol que está permitido para acceder a esta ruta
      if (user && roles.includes(user.user.role)) {
        next(); 
      } else {
        res.status(403).send('Acceso denegado. No tienes los permisos necesarios para acceder a esta ruta.');
      }
    };
  }
  


  