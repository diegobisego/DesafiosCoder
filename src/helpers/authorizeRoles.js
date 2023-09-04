// Middleware para autorización y delimitar el acceso
export function authorizeRolesAdminPremium() {
  return (req, res, next) => {
    const user = req.user;

    // Verificar si el usuario tiene un rol que está permitido para acceder a esta ruta
    if (user && (user.user.role === 'Admin' || user.user.role === 'premium')) {
      next(); 
    } else {
      res.status(403).send('Acceso denegado. No tienes los permisos necesarios para acceder a esta ruta.');
    }
  };
}


export function authorizeRoleUser() {
  return (req, res, next) => {
    const user = req.user;

    // Verificar si el usuario tiene un rol que está permitido para acceder a esta ruta
    if (user && user.user.role === 'Usuario') {
      next(); 
    } else {
      res.status(403).send('Acceso denegado. No tienes los permisos necesarios para acceder a esta ruta.');
    }
  };
}

  


  