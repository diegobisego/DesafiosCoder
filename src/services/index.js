import ProductRepository from "./repositories/productRepository.js";
import CartRepository from "./repositories/cartRepository.js";
import PersistenceFactory from "../dao/factory.js";

export const ProductService = new ProductRepository(await PersistenceFactory.getProductPersistence())
export const CartService = new CartRepository(await PersistenceFactory.getCartsPersistence())