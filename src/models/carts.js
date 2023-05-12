import mongoose from "mongoose";

//a quien apunto a la base
const collection = 'carts'

//esquema de products
const schema = new mongoose.Schema({
    id: { type: Number, unique: true },
    products: Array
}, {timestamps:{createdAt:'createDate', updatedAt:'updateDate'}})


const productModel = mongoose.model(collection,schema)


export default productModel