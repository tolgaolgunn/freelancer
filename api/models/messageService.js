import mongoose from "mongoose";
import cron from "node-cron";
import Message from "./messageModel.js"; 
import dotenv from 'dotenv';
dotenv.config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

const messageService = () => {
  cron.schedule('*/1 * * * * *', async () => { // Her 10 saniyede bir çalışacak şekilde ayarlandı
    // console.log('Running message aggregate job every 10 seconds');
    try {
      await Message.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userInfo"
          }
        },
        {
          $unwind: {
            path: "$userInfo",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            senderName: { $ifNull: ["$userInfo.username", ""] },
            receivedName: { $ifNull: ["$userInfo.username", ""] }
          }
        },
        {
          $merge: {
            into: "messages",
            whenMatched: "merge",
            whenNotMatched: "discard"
          }
        }
      ]);
    //   console.log('Message aggregate job completed');
    } catch (error) {
      console.error('Error during message aggregate job:', error);
    }
  });
};

export default messageService;