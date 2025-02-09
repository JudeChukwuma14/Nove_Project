const mongoose = require("mongoose");

const checkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    product: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        },
      },
    ],
    trxref: {
      type: String,
    },
    reference: {
      type: String,
    },
    status: {
      type: Boolean,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Check", checkSchema);