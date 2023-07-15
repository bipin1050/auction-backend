const Product = require("../model/productModel");

const createProduct = async (req, res) => {
  try {
    const {
      productName,
      enableBid,
      minimumBid,
      enableInstantBuy,
      instantBuy,
      endDate,
    } = req.body;

    const {payload} = req.user
    const newProduct = new Product({
      productName,
      image: req.file.filename,
      enableBid : enableBid==""?false:true,
      minimumBid,
      enableInstantBuy : enableInstantBuy==""?false:true,
      instantBuy,
      endDate,
      userid: payload,
    });

    await newProduct.save();

    res.status(200).json({ message: "Product created successfully" });
  } catch (error) {
    console.log("error", error.message)
    return res.status(500).json({ error: error.message });
  }
};

const getActiveBids = async (req, res) => {
  try{
    let { payload } = req.user;
    const products = await Product.find({
      userid: payload,
      status: "active",
    });

    res.status(200).json(products);   
  }catch(error){
    console.log("error", error.message);
    return res.status(500).json({ error: error.message });
  }
}

const getClosedBids = async (req, res) => {
  try {
    let { payload } = req.user;
    const products = await Product.find({
      userid: payload,
      status: "closed",
    });

    res.status(200).json(products);
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getAllActiveBids = async (req, res) => {
  try {
    const products = await Product.find({
      status: "active",
    });

    res.status(200).json(products);
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ error: error.message });
  }
}

const productDetails = async (req, res) => {
  try {
    let id = req.params.id;
    const products = await Product.findById(id);

    res.status(200).json(products);
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getActiveBids,
  getClosedBids,
  getAllActiveBids,
  productDetails,
};
