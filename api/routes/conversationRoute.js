import express from "express";
import {
  createConversation,
  getConversationExpress,
  getSingleConversation,
  updateConversation,
} from "../controllers/conversationController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", verifyToken, getConversationExpress);
router.post("/", verifyToken, createConversation);
router.get("/single/:id", verifyToken, getSingleConversation);
router.put("/:id", verifyToken, updateConversation);

export default router;
