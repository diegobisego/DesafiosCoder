import mongoose from "mongoose";

//a quien apunto a la base
const collection = 'users'

//esquema de users
const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, unique: true },
  age: {type: Number},
  password: { type: String },
  role: { type: String, default: 'Usuario' },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
}, { timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });


const userModel = mongoose.model(collection,userSchema)


export default userModel