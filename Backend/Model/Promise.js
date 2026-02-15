const mongoose = require('mongoose');

// Schema for tracking the history of status changes
const PromiseHistorySchema = new mongoose.Schema({
    oldStatus: String,
    newStatus: String,
    reason: String,
    changedAt: { type: Date, default: Date.now }
});

const PromiseSchema = new mongoose.Schema({
    politicianId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Politician', 
        required: true 
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Kept', 'Broken', 'In-Progress'], 
        default: 'Pending' 
    },
    evidenceNotes: String,
    history: [PromiseHistorySchema] // Embedded history for clean data modeling
}, { timestamps: true });

module.exports = mongoose.model('Promise', PromiseSchema);