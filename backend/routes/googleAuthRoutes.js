import express from "express";
import { googleAuthStart, googleAuthCallback, googleAuthStatus } from "../controllers/googleAuthController.js";

const router = express.Router();
router.get("/google", googleAuthStart);
router.get("/google/callback", googleAuthCallback);
router.get("/status", googleAuthStatus);

export default router;
