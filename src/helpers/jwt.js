import Jwt from "jsonwebtoken";

// genera el token
export const generateToken = (user) => {
    //aca genero token, mando el user como la firma, el secret y el tiempo de expiracion
    const token = Jwt.sign({user}, 'jwtSecret', {expiresIn: '24h'})
    return token
}