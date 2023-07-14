const express = require("express");
const productRouter = express.Router();
const { upload } = require("../utility/multer");
const { createProduct } = require("../controller/productController");
const { verifyToken } = require("../middleware/auth");

productRouter.post(
  "/createProduct",
  verifyToken,
  upload.single("image"),
  createProduct
);

module.exports = productRouter;
