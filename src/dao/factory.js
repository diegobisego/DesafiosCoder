import config from '../config/config.js'
import mongoose from "mongoose";
const persistence = config.app.PERSISTENCE




export default class PersistenceFactory {

    // persistencia para products
    static async getProductPersistence() {
        let productDAO
        switch (persistence) {
            case 'FS':
                const {default: fsProductDAO} = await import('./fileSystem/manager/ProductManager.js')   
                productDAO = new fsProductDAO()
                break;
            case 'MONGO':
                const MONGOURI = config.mongo.MONGO_URI;
                mongoose.connect(MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true, dbName: "ecommerce"});
                const {default: mongoProductDAO} = await import('./mongo/manager/mongoProducts.js')   
                productDAO = new mongoProductDAO()
                break;
            default:
                break;
        }
    return productDAO
    }

    // persistencia para carts
    static async getCartsPersistence() {
        let cartDAO
        switch (persistence) {
            case 'FS':
                const {default: fsCartDAO} = await import('./fileSystem/manager/CartManager.js')   
                cartDAO = new fsCartDAO()
                break;
            case 'MONGO':
                const MONGOURI = config.mongo.MONGO_URI;
                mongoose.connect(MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true, dbName: "ecommerce"});
                const {default: mongoCartDAO} = await import('./mongo/manager/mongoCarts.js')   
                cartDAO = new mongoCartDAO()
                break;
            default:
                break;
        }
    return cartDAO
    }
}