import express from "express";
import {
  createMessage,
  getMessageExpress,
} from "../controllers/messageController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createMessage);
router.get("/:id", verifyToken, getMessageExpress);

export default router;
