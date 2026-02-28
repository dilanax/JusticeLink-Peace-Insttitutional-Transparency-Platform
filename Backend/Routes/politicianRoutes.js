import express from "express";
import {
  createPolitician,
  getPoliticians,
  getPoliticianById,
  updatePolitician,
  deletePolitician
} from "../Controller/politicianController.js";

import { protect } from "../Middleware/authMiddleware.js";
import { authorizeRoles } from "../Middleware/roleMiddleware.js";

const router = express.Router();

// 🔐 ADMIN ONLY
router.post("/", protect, authorizeRoles("admin"), createPolitician);
router.put("/:id", protect, authorizeRoles("admin"), updatePolitician);
router.delete("/:id", protect, authorizeRoles("admin"), deletePolitician);

// 🌍 Public
router.get("/", getPoliticians);
router.get("/:id", getPoliticianById);

export default router;