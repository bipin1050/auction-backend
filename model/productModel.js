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
    required: true,
  },
  minimumBid: {
    type: Number,
    required: true,
  },
  enableInstantBid: {
    type: Boolean,
    required: true,
  },
  instantBuy: {
    type: Number,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
});

const productModel = mongoose.model("productModel", productSchema);

module.exports = productModel;
