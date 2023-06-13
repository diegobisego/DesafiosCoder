import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: Array
  },
  { timestamps: { createdAt: "createDate", updatedAt: "updateDate" } }
);

const ProductModel = mongoose.model(productCollection, productSchema);

export default ProductModel;
