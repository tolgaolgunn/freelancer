import mongoose from "mongoose";
import cron from "node-cron";
import Order from "./orderModel.js"; 
import dotenv from 'dotenv';
dotenv.config();

mongoose.set({
    strictQuery: false
})
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

const startScheduledJob=()=>{
    cron.schedule('*/5 * * * * *', async () => {
        // console.log('Running aggregate job every 5 seconds...');
        await Order.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "sellerId",
              foreignField: "_id",
              as: "sellerInfo"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "buyerId",
              foreignField: "_id",
              as: "buyerInfo"
            }
          },
          {
            $unwind: {
              path: "$sellerInfo",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $unwind: {
              path: "$buyerInfo",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $addFields: {
              sellerName: { $ifNull: ["$sellerInfo.username", ""] },
              buyerName: { $ifNull: ["$buyerInfo.username", ""] }
            }
          },
          {
            $merge: {
              into: "orders",
              whenMatched: "merge",
              whenNotMatched: "discard"
            }
          }
        ]);
      });
}
export default startScheduledJob;