import express from "express";
import {
  createGig,
  deleteGig,
  getGigExpress,
  getGigs
} from "../controllers/gigController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createGig);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGigExpress);
router.get("/", getGigs);

export default router;
