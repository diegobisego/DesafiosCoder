export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    existUser = (user) => {
        return this.dao.existUser(user);
    }
}
