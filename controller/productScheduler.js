const cron = require("node-cron");
const productModel = require("../model/productModel");
const userModel = require("../model/userModel");

async function processExpiredProducts() {
  try {
    const expiredProducts = await productModel.find({
      status: "active",
      endDate: { $lt: new Date() },
    });
    for (const product of expiredProducts) {
      const highestBidder = product.bidders.reduce((prev, current) =>
        current.amount > prev.amount ? current : prev
      );
      if (highestBidder) {
        // Update the winner field in the product
        product.winner = highestBidder.username;

        // Deduct balance from the highest bidder's hold balance
        const bidder = await userModel.findById(highestBidder.userid);
        if (bidder) {
          bidder.holdbalance -= highestBidder.amount;
          await bidder.save();
        }

        // Add balance to the bid placer or owner
        const owner = await userModel.findById(product.userid);
        if (owner) {
          owner.balance += highestBidder.amount;
          await owner.save();
        }

        // Release hold balance for other bidders
        for (const bidder of product.bidders) {
          if (bidder.id !== highestBidder.id) {
            const otherBidder = await userModel.findById(bidder.id);
            if (otherBidder) {
              otherBidder.balance += bidder.amount;
              otherBidder.holdbalance -= bidder.amount;
              await otherBidder.save();
            }
          }
        }

        // Save the updated product with the winner field
        await product.save();
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Schedule the job to run on starting of day
cron.schedule("0 0 * * *", processExpiredProducts);
