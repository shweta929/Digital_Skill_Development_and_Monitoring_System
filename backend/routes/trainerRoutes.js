import express from "express";
import Trainer from "../models/Trainer.js";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.json(trainers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch trainers" });
    }
});

export default router;
