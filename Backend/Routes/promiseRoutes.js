const express = require('express');
const router = express.Router();
const promiseController = require('../Controller/promiseController');
const { protect, authorize } = require('../Middleware/authMiddleware'); // For RBAC [cite: 24]

router.get('/', (req, res) => promiseController.getAll(req, res));
router.get('/:id', (req, res) => promiseController.getById(req, res));
router.get('/stats/:politicianId', (req, res) => promiseController.getStatsByPolitician(req, res));

// Protected routes: Only 'admin' or 'politician' can create/update [cite: 24]
router.post('/', protect, authorize('admin'), (req, res) => promiseController.create(req, res));
router.patch('/:id/status', protect, authorize('admin'), (req, res) => promiseController.updateStatus(req, res));

module.exports = router;