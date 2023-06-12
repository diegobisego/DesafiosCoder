import mongoose from "mongoose";

//a quien apunto a la base
const collection = 'users'

//esquema de products
const schema = new mongoose.Schema({
    name: { type: String},
    lastname: { type: String},
    email: { type: String, unique: true},
    password: { type: String},
    role:{ type: String},
  }, { timestamps: { createdAt: 'createDate', updatedAt: 'updateDate' } });


const userModel = mongoose.model(collection,schema)


export default userModel