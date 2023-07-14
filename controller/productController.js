const Product = require("../model/productModel");

const createProduct = async (req, res) => {
  try {
    console.log("check",req.file);
    // const {
    //   productName,
    //   enableBid,
    //   minimumBid,
    //   enableInstantBuy,
    //   instantBuy,
    //   endDate,
    // } = req.body;

    // const newProduct = new Product({
    //   productName,
    //   image: req.file.filename,
    //   enableBid,
    //   minimumBid,
    //   enableInstantBid: enableInstantBuy,
    //   instantBuy,
    //   endDate,
    //   userid: req.userId,
    // });

    // await newProduct.save();

    res.status(200).json({ message: "Product created successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
};
