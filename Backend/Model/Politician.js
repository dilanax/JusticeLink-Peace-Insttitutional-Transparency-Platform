const mongoose = require('mongoose');

// Define the Schema - Satisfies Requirement 108 (Data Modeling)
const PoliticianSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please add a name'], 
        trim: true 
    },
    party: { 
        type: String, 
        required: [true, 'Please add a political party'] 
    },
    bio: { 
        type: String, 
        required: [true, 'Please add a biography'] 
    },
    imageUrl: { 
        type: String, 
        default: 'no-photo.jpg' 
    },
    // This creates a virtual relationship with the Promise model
    // Satisfies Requirement 63 (Interaction between controllers and DB)
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Cascade delete promises when a politician is deleted
PoliticianSchema.pre('remove', async function (next) {
    await this.model('Promise').deleteMany({ politicianId: this._id });
    next();
});

// Reverse populate with Virtuals: Links 'Promise' to this 'Politician'
PoliticianSchema.virtual('promises', {
    ref: 'Promise',
    localField: '_id',
    foreignField: 'politicianId',
    justOne: false
});

module.exports = mongoose.model('Politician', PoliticianSchema);