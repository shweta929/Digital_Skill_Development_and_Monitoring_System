import express from "express";
import { requestMeeting, listMeetings, approveMeeting, smartAutoScheduleMeeting, rejectMeeting, rescheduleMeeting } from "../controllers/meetingController.js";

const router = express.Router();

router.post("/request", requestMeeting);
router.get("/list", listMeetings);
router.get("/trainer/:trainerId", listMeetings); // Compatibility with AdminScheduleView
router.post("/approve", approveMeeting);
router.post("/smart-auto", smartAutoScheduleMeeting);
router.post("/reject", rejectMeeting);
router.post("/reschedule", rescheduleMeeting);

// PUT Compatibility for AdminScheduleView
router.put("/:meetingId/complete", approveMeeting); // Using approve as completion for now
router.put("/:meetingId/cancel", rejectMeeting);
router.put("/:meetingId/reschedule", rescheduleMeeting);

export default router;
