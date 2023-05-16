import mongoose from "mongoose";

//a quien apunto a la base
const collection = 'messages'

//esquema de products
const schema = new mongoose.Schema({
    user: { type: String, unique: true },
    message: String
}, {timestamps:{createdAt:'createDate', updatedAt:'updateDate'}})


const chatModel = mongoose.model(collection,schema)


export default chatModel