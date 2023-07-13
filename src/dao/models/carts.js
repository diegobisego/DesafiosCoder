import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema(
  {
    products: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      quantity: Number
    }],
  },
  { timestamps: { createdAt: "createDate", updatedAt: "updateDate" } }
);

// Middleware pre para población de datos antes de la consulta
cartSchema.pre(/^find/, function (next) {
  this.populate("products");
  next();
});

const CartModel = mongoose.model(cartCollection, cartSchema);

export default CartModel;