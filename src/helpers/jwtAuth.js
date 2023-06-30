import Jwt from "jsonwebtoken";

export const authToken = (req, res, next) => {
  try {
    const authHrader = req.headers.authorization; // viene del header - genera el token

    if (!authHrader)
      res.status(401).send({ success: false, message: "No estas autorizado" }); // rechaza si no esta autorizado
    const token = authHrader.split(" ")[1]; // esto es porque el token viene con una palabra Bearer y solo necesitamos el token

    //debo verificar si es valido el token
    Jwt.verify(token, "jwtSecret", (error, credentials) => {
      if (error) {
        return res.status(401).json({
          success: false,
          message: "Token invalido",
        });
      }
      req.user = credentials.user;
      next();
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `Error al intentar realizar la autenticacion de token: ${err}`,
    });
  }
};
