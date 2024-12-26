import express from "express";
import { register, loginExpress, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", loginExpress)
router.post("/logout", logout)

export default router;
