export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    existUser = (user) => {
        return this.dao.existUser(user);
    }

    changeUserPassword = (email, password) => {
        return this.dao.changeUserPassword(email , password);
    }

    changeRole = (id) => {
        return this.dao.changeRole(id)
    }

    logoutUpdate = (id) => {
        return this.dao.logoutUpdate(id)
    }

    uploadDocuments = (id,uploadedFiles,documents) => {
        return this.dao.uploadDocuments(id,uploadedFiles,documents)
    }

    getAllUsers = () => {
        return this.dao.getAllUsers()
    }
    


}
