const express = require("express");
const productRouter = express.Router();
const { upload } = require("../utility/multer");
const {
  createProduct,
  getActiveBids,
  getClosedBids,
  getAllActiveBids,
  productDetails,
} = require("../controller/productController");
const { verifyToken } = require("../middleware/auth");

productRouter.post(
  "/createProduct",
  verifyToken,
  upload.single("image"),
  createProduct
);
productRouter.get("/getActiveBids", verifyToken, getActiveBids);
productRouter.get("/getClosedBids", verifyToken, getClosedBids);
productRouter.get("/getAllActiveBids", getAllActiveBids);
productRouter.get("/productDetails/:id", productDetails);


module.exports = productRouter;
