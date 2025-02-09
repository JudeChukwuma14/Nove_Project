const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    images: {
      type: [String],
    },
    quantity:{
      type:Number,
      default:1
    },
    status:{
      type:String,
      enum:["popular", "sales", "new", ""],
      default: "",
    },
    rating:{
      type: Number,
      default: 5,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
