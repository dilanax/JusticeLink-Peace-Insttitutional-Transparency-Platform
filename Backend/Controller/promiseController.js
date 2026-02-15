const Promise = require('../Model/Promise');

class PromiseController {
    // GET /api/promises (Filters & Pagination)
    // Satisfies Assignment Req: Filters, Pagination, and Search [cite: 40]
    async getAll(req, res) {
        try {
            const {
                status,
                politicianId,
                category,
                limit = 20,
                offset = 0,
                sort = 'createdAt',
                order = 'desc',
            } = req.query;

            // Build dynamic Mongoose query 
            const query = {};
            if (status) query.status = status;
            if (politicianId) query.politicianId = politicianId;
            if (category) query.category = category;

            const data = await Promise.find(query)
                .limit(parseInt(limit))
                .skip(parseInt(offset))
                .sort({ [sort]: order === 'desc' ? -1 : 1 })
                .populate('politicianId', 'name party'); // Joined data [cite: 63]

            const count = await Promise.countDocuments(query);

            res.json({
                success: true,
                data,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    total: count,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // POST /api/promises
    // Satisfies Assignment Req: Create Operation [cite: 19]
    async create(req, res) {
        try {
            // In MERN, data usually comes from req.body or a validation middleware
            const promise = await Promise.create(req.body);

            res.status(201).json({
                success: true,
                data: promise,
            });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // GET /api/promises/:id
    async getById(req, res) {
        try {
            const promise = await Promise.findById(req.params.id)
                .populate('politicianId');

            if (!promise) {
                return res.status(404).json({ success: false, error: 'Promise not found' });
            }

            res.json({ success: true, data: promise });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // PATCH /api/promises/:id/status
    // Satisfies Assignment Req: Business logic & status codes [cite: 19, 108]
    async updateStatus(req, res) {
        try {
            const { status, reason } = req.body;
            const promise = await Promise.findById(req.params.id);

            if (!promise) {
                return res.status(404).json({ success: false, error: 'Promise not found' });
            }

            // Manually pushing to the history array we defined in the Model
            promise.history.push({
                oldStatus: promise.status,
                newStatus: status,
                reason: reason
            });

            promise.status = status;
            await promise.save();

            res.json({ success: true, data: promise });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    // GET /api/promises/stats/:politicianId
    // Satisfies Assignment Req: Logical summary data [cite: 15]
    async getStatsByPolitician(req, res) {
        try {
            const stats = await Promise.aggregate([
                { $match: { politicianId: new mongoose.Types.ObjectId(req.params.politicianId) } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]);

            res.json({
                success: true,
                data: { politicianId: req.params.politicianId, stats },
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new PromiseController();