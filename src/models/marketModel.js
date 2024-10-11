import mongoose from 'mongoose';

const marketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        primary: true
    },
    result: {
        type: String,
        required: true,
        default:"***_**_***"
    },
    open: {
        type: String,
        required: true
    },
    close: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const market = mongoose.model('markets', marketSchema);

export default market;
