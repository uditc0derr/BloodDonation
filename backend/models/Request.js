const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodGroup: { type: String, required: true },
  status: { type: String, enum: ['pending', 'matched', 'completed'], default: 'pending' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  matchedDonor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

RequestSchema.index({ location: '2dsphere' }); // For geospatial queries

module.exports = mongoose.model('Request', RequestSchema);
