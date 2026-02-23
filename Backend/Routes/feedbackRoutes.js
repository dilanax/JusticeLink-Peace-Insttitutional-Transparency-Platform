import express from "express";
import {
  createFeedback,
  getFeedbackByPromise,
  voteFeedback,
  updateFeedback,
  deleteFeedback,
} from "../Controller/feedbackController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/:promiseId", protect, createFeedback);
router.get("/:promiseId", getFeedbackByPromise);
router.post("/:promiseId/vote", protect, voteFeedback);
router.patch("/:id", protect, updateFeedback);
router.delete("/:id", protect, deleteFeedback);

export default router;