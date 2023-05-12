import mongoose from "mongoose";

//a quien apunto a la base
const collection = 'products'

//esquema de products
const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: Array
}, { timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });

const productModel = mongoose.model(collection,productsSchema)


export default productModel