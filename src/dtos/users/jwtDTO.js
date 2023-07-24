import Jwt from "jsonwebtoken";

export default class TokenDTO {
    constructor(user) {
        this.user = user;
    }

    // Genera el token, usando el user como la firma, el secret y el tiempo de expiración
    generateToken = () => {
        const token = Jwt.sign({ user: this.user }, 'jwtSecret', { expiresIn: '24h' });
        return token;
    }
}
