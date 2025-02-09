const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});


module.exports = mongoose.model("Cart", CartSchema)