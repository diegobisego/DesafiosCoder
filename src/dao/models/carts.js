import mongoose from "mongoose";

//a quien apunto a la base
const collection = 'carts'

//esquema de products
const schema = new mongoose.Schema({
    id: { type: Number, unique: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }]
  }, { timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });


const cartModel = mongoose.model(collection,schema)


export default cartModel