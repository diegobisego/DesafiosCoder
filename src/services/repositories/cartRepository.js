export default class CartRepository {
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

    postProductInCart = (cid, pid) => {
        return this.dao.postProductInCart(cid, pid)
    }

    putProductInCart = (cid, pid, quantity) => {
        return this.dao.putProductInCart(cid, pid, quantity)
    }

    deleteCart = (cid) => {
        return this.dao.deleteCart(cid)
    }

    deleteProductInCart = (cid,pid) => {
        return this.dao.deleteProductInCart(cid,pid)
    }


}