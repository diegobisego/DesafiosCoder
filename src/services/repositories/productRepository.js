export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    getOneProduct = (pid) => {
        return this.dao.getProductById(pid)
    }
    
    getAllProducts = () => {
        return this.dao.getProducts()
    }

    postOneProduct = (title, description, code, price, quantity, category, thumbnails, owner) => {
        return this.dao.addProduct(title, description, code, price, quantity, category, thumbnails, owner)
    }

    putOneProduct = (pid, product) => {
        return this.dao.updateProduct(pid, product)
    }

    deleteOneProduct = (pid) => {
        return this.dao.deleteProduct(pid)
    }


}