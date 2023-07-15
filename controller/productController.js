const productModel = require("../model/productModel");
const userModel = require("../model/userModel");

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

    // console.log("body",req.body)
    const { payload } = req.user;
    const newProduct = new productModel({
      productName,
      image: req.file.filename,
      enableBid: enableBid == "true" ? true : false,
      minimumBid,
      enableInstantBuy: enableInstantBuy == "true" ? true : false,
      instantBuy,
      endDate,
      userid: payload,
    });

    await newProduct.save();

    res.status(200).json({ message: "Product created successfully" });
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// const getActiveBids = async (req, res) => {
//   try {
//     let { payload } = req.user;
//     const products = await productModel.find({
//       userid: payload,
//       status: "active",
//     });

//     res.status(200).json(products);
//   } catch (error) {
//     console.log("error", error.message);
//     return res.status(500).json({ error: error.message });
//   }
// };

const getActiveBids = async (req, res) => {
  try {
    const { payload } = req.user;

    const products = await productModel.aggregate([
      {
        $match: {
          userid: payload,
          status: "active",
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          image: 1,
          enableBid: 1,
          minimumBid: 1,
          enableInstantBuy: 1,
          instantBuy: 1,
          endDate: 1,
          status: 1,
          userid: 1,
          highestBid: { $max: "$bidders.amount" },
          bidCount: { $size: "$bidders" },
        },
      },
    ]);

    res.status(200).json(products);
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ error: error.message });
  }
};


const getClosedBids = async (req, res) => {
  try {
    let { payload } = req.user;
    const products = await productModel.aggregate([
      {
        $match: {
          userid: payload,
          status: "closed",
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          image: 1,
          enableBid: 1,
          minimumBid: 1,
          enableInstantBuy: 1,
          instantBuy: 1,
          endDate: 1,
          status: 1,
          userid: 1,
          winner: 1,
          highestBid: { $max: "$bidders.amount" },
          bidCount: { $size: "$bidders" },
        },
      },
    ]);

    res.status(200).json(products);
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// const getActiveProductsBidded = async (req, res) => {
//   const { payload } = req.user;

//   try {
//     const products = await productModel.find({
//       status: "active",
//       bidders: {
//         $elemMatch: { id: payload },
//       },
//     });
//     console.log("pr", { products });
//     return res.status(200).json(products);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

const getActiveProductsBidded = async (req, res) => {
  const { payload } = req.user;

  try {
    const products = await productModel.aggregate([
      {
        $match: {
          status: "active",
          "bidders.id": payload,
        },
      },
      {
        $addFields: {
          highestBid: {
            $max: "$bidders.amount",
          },
          bidCount: {
            $size: "$bidders",
          },
          userBid: {
            $filter: {
              input: "$bidders",
              cond: { $eq: ["$$this.id", payload] },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          image: 1,
          enableBid: 1,
          minimumBid: 1,
          enableInstantBuy: 1,
          instantBuy: 1,
          endDate: 1,
          status: 1,
          userid: 1,
          highestBid: 1,
          bidCount: 1,
          userBid: {
            $arrayElemAt: ["$userBid.amount", 0],
          },
        },
      },
    ]);

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getClosedProductsBidded = async (req, res) => {
  const { payload } = req.user;

  try {
    // const products = await productModel.find({
    //   status: "closed",
    //   bidders: {
    //     $elemMatch: { id: payload },
    //   },
    // });
    const products = await productModel.aggregate([
      {
        $match: {
          status: "closed",
          "bidders.id": payload,
        },
      },
      {
        $addFields: {
          highestBid: {
            $max: "$bidders.amount",
          },
          bidCount: {
            $size: "$bidders",
          },
          userBid: {
            $filter: {
              input: "$bidders",
              cond: { $eq: ["$$this.id", payload] },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          image: 1,
          enableBid: 1,
          minimumBid: 1,
          enableInstantBuy: 1,
          instantBuy: 1,
          endDate: 1,
          status: 1,
          userid: 1,
          highestBid: 1,
          winner:1,
          bidCount: 1,
          userBid: {
            $arrayElemAt: ["$userBid.amount", 0],
          },
        },
      },
    ]);

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllActiveBids = async (req, res) => {
  try {
    const products = await productModel.aggregate([
      {
        $match: {
          status: "active",
        },
      },
      {
        $addFields: {
          bidCount: {
            $size: "$bidders",
          },
        },
      },
    ]);

    res.status(200).json(products);
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const productDetails = async (req, res) => {
  try {
    let id = req.params.id;
    // const products = await productModel.findById(id);
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const highestBid = Math.max(...product.bidders.map((bidder) => bidder.amount));
    const bidCount = product.bidders.length;

    const productDetails = {
      _id: product._id,
      productName: product.productName,
      image: product.image,
      enableBid: product.enableBid,
      minimumBid: product.minimumBid,
      enableInstantBuy: product.enableInstantBuy,
      instantBuy: product.instantBuy,
      endDate: product.endDate,
      status: product.status,
      userid: product.userid,
      bidders: product.bidders,
      winner: product.winner,
      highestBid,
      bidCount,
    };

    res.status(200).json(productDetails);
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const placeBid = async (req, res) => {
  try {
    const { buyType, userId, productId, bidAmount } = req.body;

    const product = await productModel.findById(productId);
    const bidder = await userModel.findById(userId);

    if (product.userid == userId) {
      return res.status(400).json({
        message: "You can't bid/buy own product",
      });
    }

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    if (!bidder) {
      return res.status(404).json({
        message: "Bidder not found",
      });
    }

    if (bidder.balance < bidAmount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // Check if instant buy is enabled and the user wants to buy it instantly
    if (product.enableInstantBuy && buyType === "instantbuy") {
      const owner = await userModel.findById(product.userid);
      console.log(owner);
      console.log("instntBuy");

      // Update the product status to closed
      product.status = "closed";
      // Set the buyer ID
      product.bidders.push({ id: userId, amount: product.instantBuy });
      product.winner = bidder.username;

      // Deduct the instant buy amount from the bidder's balance
      bidder.balance -= product.instantBuy;
      console.log(owner.balance);
      owner.balance += product.instantBuy;
      console.log(owner.balance);

      // Save the updated product and bidder
      await product.save();
      await bidder.save();
      await owner.save();

      return res.status(200).json({
        message: "Product purchased successfully",
      });
    }

    // Check if bid is enabled and the user wants to place a bid
    if (product.enableBid && buyType === "placebid") {
      // Check if bid amount is less than the minimum bid
      if (bidAmount < product.minimumBid) {
        return res.status(400).json({
          message: "Low Bid Amount",
        });
      }

      // Check if the bidder has already placed a bid
      const existingBidder = product.bidders.find(
        (bidder) => bidder.id === userId
      );

      if (existingBidder) {
        // Update the existing bid amount
        bidder.balance += Number(existingBidder.amount);
        bidder.holdbalance -= existingBidder.amount;
        existingBidder.amount = bidAmount;
      } else {
        // Add the bidder's bid to the product's bidders array
        product.bidders.push({
          id: userId,
          amount: bidAmount,
        });
      }

      // Deduct the bid amount from the bidder's balance
      bidder.balance -= bidAmount;
      bidder.holdbalance += Number(bidAmount);

      // Save the updated product and bidder
      await product.save();
      await bidder.save();

      return res.status(200).json({
        message: "Bid placed successfully",
      });
    }

    // If neither instant buy nor bid is enabled, return an error
    return res.status(400).json({
      message: "Invalid bid request",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const cancelBid = async (req, res) => {
  try {
    const { productId, bidderId } = req.body;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("bidders", product.bidders)
    console.log("bidderId", bidderId);

    const bidderIndex = product.bidders.findIndex(
      (bidder) => bidder.id === bidderId
    );
    if (bidderIndex === -1) {
      return res.status(404).json({ message: "Bidder not found" });
    }

    const bidAmount = product.bidders[bidderIndex].amount;
    product.bidders.splice(bidderIndex, 1);
    await product.save();

    // Find the bidder's user model and update balance
    const bidder = await userModel.findById(bidderId);

    if (!bidder) {
      return res.status(404).json({ message: "Bidder not found" });
    }
    bidder.balance += Number(bidAmount);
    bidder.holdbalance -= bidAmount;
    await bidder.save();

    res.status(200).json({ message: "Bidder removed successfully" });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = {
  createProduct,
  getActiveBids,
  getClosedBids,
  getActiveProductsBidded,
  getClosedProductsBidded,
  getAllActiveBids,
  productDetails,
  placeBid,
  cancelBid,
};
