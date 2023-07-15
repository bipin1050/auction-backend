const express = require("express");
const productRouter = express.Router();
const { upload } = require("../utility/multer");
const {
  createProduct,
  getActiveBids,
  getClosedBids,
  getActiveProductsBidded,
  getClosedProductsBidded,
  getAllActiveBids,
  productDetails,
  placeBid,
  cancelBid,
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
productRouter.get("/getActiveProductsBidded", verifyToken, getActiveProductsBidded);
productRouter.get("/getClosedProductsBidded", verifyToken, getClosedProductsBidded);
productRouter.get("/getAllActiveBids", getAllActiveBids);
productRouter.get("/productDetails/:id", productDetails);
productRouter.post("/placeBid", verifyToken, placeBid);
productRouter.post("/cancelBid", verifyToken, cancelBid);



module.exports = productRouter;
