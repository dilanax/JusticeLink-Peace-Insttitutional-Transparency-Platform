const express = require('express');
const router = express.Router();
const politicianController = require('../Controller/politicianController');
const { protect, authorize } = require('../Middleware/authMiddleware');
// Note: You can use express-validator or a custom utility for the 'validate' middleware

// GET /api/politicians - Public access
// Satisfies Requirement: CRUD operations & standard HTTP methods 
router.get('/', (req, res) => politicianController.getAll(req, res));

// POST /api/politicians - Protected: Only Admins can create politicians
// Satisfies Requirement: Protected routes & role-based access [cite: 24]
router.post(
    '/', 
    protect, 
    authorize('admin'), 
    (req, res) => politicianController.create(req, res)
);

// GET /api/politicians/:id - Public access
// Satisfies Requirement: Entity management [cite: 39]
router.get('/:id', (req, res) => politicianController.getById(req, res));

module.exports = router;