import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import gigRoute from "./routes/gigRoute.js";
import orderRoute from "./routes/orderRoute.js";
import conversationRoute from "./routes/conversationRoute.js";
import messageRoute from "./routes/messageRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import  schedule  from "node-schedule";
import { removeExpiredOrders } from "./controllers/orderController.js";
import startScheduledJob from './models/scheduledJob.js';
import messageService from "./models/messageService.js";
import { startAuthSoapServer } from './controllers/authController.js'; 
import { startConversationSoapServer } from './controllers/conversationController.js'; 
import { startGigSoapServer } from './controllers/gigController.js';
import { startMessageSoapServer } from './controllers/messageController.js';
import { startOrderSoapServer } from './controllers/orderController.js';
import { startReviewSoapServer } from './controllers/reviewController.js';
import { startSoapServer } from './controllers/userController.js';
import './grpcServer.js';

const app = express();
dotenv.config();
mongoose.set("strictQuery", false);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({limit:'50mb'}));
app.use(cookieParser());
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});
schedule.scheduleJob("0 * * * *", removeExpiredOrders);

app.listen(8800, () => {
  connect();
  messageService();
  startScheduledJob();
  startAuthSoapServer(app); 
  startConversationSoapServer(app); 
  startGigSoapServer(app);
  startMessageSoapServer(app);
  startOrderSoapServer(app);
  startReviewSoapServer(app);
  startSoapServer(app);
  console.log("Backend server is running!");
  
});
