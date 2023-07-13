export default class UserService {
    constructor(dao) {
        this.dao = dao
    }

    getOneProduct = (newUser) => {
        return this.dao.createUser(newUser)
    }



}