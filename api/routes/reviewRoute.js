import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createReview,
  getReviewExpress,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", verifyToken, createReview )
router.get("/:gigId", getReviewExpress )
router.delete("/:id", deleteReview)

export default router;
