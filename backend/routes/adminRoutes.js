import express from "express";
import { getCRMAnalytics, adminLogin, getCRMLeads, getAllFeedbacks, deleteFeedback } from "../controllers/adminController.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", adminLogin);

// GET /api/admin/crm/analytics
router.get("/crm/analytics", getCRMAnalytics);

// GET /api/admin/crm/leads
router.get("/crm/leads", getCRMLeads);

// GET /api/admin/feedbacks
router.get("/feedbacks", getAllFeedbacks);

// DELETE /api/admin/feedback/:id
router.delete("/feedback/:id", deleteFeedback);

export default router;
