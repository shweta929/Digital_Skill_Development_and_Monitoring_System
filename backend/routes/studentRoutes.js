import express from "express";
import {
    submitTest, getResult, getFeedback, postFeedback,
    saveResult, getRecordedSessions, getAllRecordedSessions, getBooks, trackBookRead, syncCounts, incrementMeetingCount,
    register, login, incrementResumeCount, checkTestEligibility, submitRetestRequest
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/submit", submitTest);
router.get("/result", getResult);
router.get("/feedback", getFeedback);
router.post("/feedback", postFeedback);
router.post("/resume/increment", incrementResumeCount);
router.get("/can-take/:studentId", checkTestEligibility);
router.post("/retest/request", submitRetestRequest);

// Enhancement Routes
router.post("/save-result", saveResult);
router.get("/sessions/all", getAllRecordedSessions);
router.get("/sessions/:studentId", getRecordedSessions);
router.get("/books/:studentId", getBooks);
router.post("/read-book", trackBookRead);
router.post("/books/view", trackBookRead); // Legacy support
router.get("/counts/:email", syncCounts);
router.post("/meeting/confirm", incrementMeetingCount);

export default router;
