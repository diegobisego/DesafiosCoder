export default class UserLoginDTO {
    constructor(user){
        this.first_name = user.first_name,
        this.email = user.email,
        this.role = user.role,
        this.id = user.id,
        this.cartId = user.cartId
    }
}