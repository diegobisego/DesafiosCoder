import ProductManager from "../dao/mongo/manager/mongoProducts.js";
import CartManager from "../dao/mongo/manager/mongoCarts.js";
import ClassProductService from "./products.services.js";
import ClassCartService from "./carts.services.js";

export const ProductService = new ClassProductService(new ProductManager())
export const CartService = new ClassCartService(new CartManager())