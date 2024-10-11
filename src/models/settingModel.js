import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  minBidAmount: {
    type: Number,
    required: true
  },
  maxBidAmount: {
    type: Number,
    required: true
  },
  welcomeBonus: {
    type: Number,
    required: true
  },
  mobileNumber: {
    type: Number,
    required: true
  },
  whatsapp: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Settings = mongoose.model('setting', settingSchema);

export default Settings;
