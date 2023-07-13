import ProductManager from "../dao/manager/mongo/mongoProducts.js";
import CartManager from "../dao/manager/mongo/mongoCarts.js";
import ClassProductService from "./products.services.js";
import ClassCartService from "./carts.services.js";

export const ProductService = new ClassProductService(new ProductManager())
export const CartService = new ClassCartService(new CartManager())