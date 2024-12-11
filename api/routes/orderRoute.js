import express from "express";
import { verifyToken, } from "../middleware/jwt.js";
import {orderActionMiddleware} from "../middleware/orderActionMiddleware.js";
import { getOrders, intent, confirm,approveOrder } from "../controllers/orderController.js";

const router = express.Router();

// router.post("/:gigId", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.post("/create-payment-intent/:id", verifyToken, intent);
router.put("/", verifyToken, confirm);
router.post("/approve/:id", verifyToken,approveOrder);

export default router;
