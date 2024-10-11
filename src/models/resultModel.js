import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    marketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'markets',
        required: true
    },
    open: {
        type: Number,
        default: null

    },
    close: {
        type: Number,
        default: null

    },
    singleAnk: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    jodi: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    singlePanna: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    doublePanna: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    triplePanna: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    halfSangamA: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    halfSangamB: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    fullSangam: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const result = mongoose.model('results', resultSchema);
export default result;
