import mongoose from 'mongoose';

const gameType = [
    {
        number: {
            type: Number,
            required: true
        },
        points: {
            type: Number,
            // required: true
        },
    }
]




const gameSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    open: {
        type: Boolean,
        required: true
    },
    marketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'markets',
        required: true,
    },
    singleAnk: {
        type: gameType,
        // 
    },
    jodi: {
        type: gameType,
        // 
    },
    singlePanna: {
        type: gameType,
        // 
    },
    doublePanna: {
        type: gameType,
        // 
    },
    triplePanna: {
        type: gameType,
        // 
    },
    halfSangamA: {
        type: [{
            open: {
                type: Number,
            },
            closeDigit: {
                type: Number,
            },
            points: {
                type: Number,
            }

        }],
        // 
    },
    halfSangamB: {
        type: [{
            close: {
                type: Number,
                required: true
            },
            openDigit: {
                type: Number,
                required: true
            },
            points:{
                type: Number,
            }
        }],
        // 
    },
    fullSangam: {
        type: [{
            open: {
                type: Number,
                required: true
            },
            close: {
                type: Number,
                required: true
            },
            points: {
                type: String,
            }
            // 
        }],
    },
    total: {
        type: Number,
        required: true

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Games = mongoose.model('Games', gameSchema);
export default Games;
