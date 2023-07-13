export default class ClassCartService {
    constructor(dao){
        this.dao = dao
    }

    getAllCarts = () => {
        return this.dao.getCarts()
    }
    
    getOneCart = (cid) => {
        return this.dao.getCartById(cid)
    }

    postCart = () => {
        return this.dao.addCart()
    }

    postProductInCart = (cid, product) => {
        return this.dao.updateProduct(cid, product)
    }

    putProductInCart = (cid, pid, quantity) => {
        return this.dao.deleteProduct(cid, pid, quantity)
    }

    deleteCart = (cid) => {
        return this.dao.deleteCart(cid)
    }

    deleteProductInCart = (cid,pid) => {
        return this.dao.deleteProductInCart(cid,pid)
    }


}