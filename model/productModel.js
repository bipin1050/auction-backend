const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "img.jpg",
    required: true,
  },
  enableBid: {
    type: Boolean,
  },
  minimumBid: {
    type: Number,
  },
  enableInstantBuy: {
    type: Boolean,
  },
  instantBuy: {
    type: Number,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "active",
  },
  userid: {
    type: String,
    required: true,
  },
  bidders: [
    {
      id: {
        type: String,
      },
      amount: {
        type: Number,
      },
    },
  ],
  winner : {
    type : String,
  }
});
productSchema.pre("validate", function (next) {
    if (!this.enableBid && !this.enableInstantBuy)
      return next(new Error("Enable at least Bid or Instant Buy"));
    if (this.enableBid && !this.minimumBid)
      return next(new Error("Minimum Bid Amount is required"));
    if (this.enableInstantBuy && !this.instantBuy)
      return next(new Error("Instant Buy Amount is required"));

  next();
});

const productModel = mongoose.model("productModel", productSchema);

module.exports = productModel;
