export default class NewUserDTO {
    constructor(newUser,hashedPassword,cartId){
        this.first_name = newUser.first_name,
        this.last_name = newUser.last_name,
        this.email = newUser.email,
        this.age = newUser.age,
        this.password = hashedPassword,
        this.role = newUser.role,
        this.cartId = cartId
    }
}