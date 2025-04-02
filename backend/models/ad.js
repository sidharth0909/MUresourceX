const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({

  adId: {
    type: String,
    unique: true,
    default: function() {
      return 'custom-' + Math.random().toString(36).substr(2, 9);
    }
  }, 
  imageUrl: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 7
  },
  stats: {
    impressions: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    }
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);