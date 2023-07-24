export default class NewUserDTO {
    constructor(newUser){
        this.first_name = newUser.first_name,
        this.last_name = newUser.last_name,
        this.email = newUser.email,
        this.age = newUser.age,
        this.password = newUser.hashedPassword,
        this.cartId = newUser.cartId
    }
}