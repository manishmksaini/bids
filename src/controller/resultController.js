import result from '../models/resultModel.js';
import market from '../models/marketModel.js';
import gameModel from '../models/gameModel.js';
import User from '../models/userModel.js';
import {
    JodiCalculator,
    SinglePannaCalculator,
    TriplePannaCalculator,
    DoublePannaCalculator,
    HalfSangamACalculatorA,
    HalfSangamACalculatorB,
    isGameMatching
} from './resultHelper.js';
import mongoose from 'mongoose';
function results(open, close) {
    const jodi = (number) => {
        let result = number ? number.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0) : "*"
        if (!isNaN(result) && result >= 10) {
            return result % 10
        }
        else {
            return result
        }
    }
    let openResult = `${open ? open : "***"}`
    let closeResult = `${close ? close : "***"}`

    return `${openResult}_${jodi(open)?.toString() + jodi(close)?.toString()}_${closeResult}`;

}


export default async function generateResult({ date, marketId, open, close }) {
    try {
        // Validate inputs
        if (!date || !marketId) {
            throw new Error('Please provide all fields');
        }

        // Find market by id
        const marketData = await market.findById(marketId);
        if (!marketData) {
            throw new Error('Market not found');
        }
        if (!isNaN(marketData.result.split('_')[0])) {
            open = Number(marketData.result.split('_')[0])
        }
        if (open && open.toString().length === 3) {
            // Check if result already exists
            let existingResult = await result.findOne({ date, marketId });

            // Calculate results
            let jodi = JodiCalculator(open, close);
            let singlePanna = SinglePannaCalculator(open, close);
            let doublePanna = DoublePannaCalculator(open, close);
            let triplePanna = TriplePannaCalculator(open, close);
            let halfSangamA = null;
            let halfSangamB = null;
            let fullSangam = null;
            let singleAnk = {
                open: open ? parseInt(open.toString()[0]) + parseInt(open.toString()[1]) + parseInt(open.toString()[2]) : null,
                close: close ? parseInt(close.toString()[0]) + parseInt(close.toString()[1]) + parseInt(close.toString()[2]) : null
            };

            if (jodi) {
                halfSangamA = HalfSangamACalculatorA(open, jodi);
                halfSangamB = HalfSangamACalculatorB(close, jodi);
            }
            if (open && close) {
                fullSangam = {
                    open: parseInt(open),
                    close: parseInt(close)
                };
            }

            // Create payload
            const payload = {
                date,
                marketId: new mongoose.Types.ObjectId(marketId),
                open,
                close,
                singleAnk,
                jodi,
                singlePanna,
                doublePanna,
                triplePanna,
                halfSangamA,
                halfSangamB,
                fullSangam
            };

            let winners = [];
            // Find games and generate result
            const games = await gameModel.find({ marketId, date });
            let newResult;

            if (existingResult) {
                // Update the existing result
                newResult = await result.findByIdAndUpdate(existingResult._id, payload, { new: true });
            } else {
                // Create new result
                newResult = new result(payload);
            }

            if (marketData.result) {
                if (!isNaN(marketData.result.split('_')[0])) {
                    payload.isUpdating = true;
                }
            }
            for (let game of games) {
                let gameResult = isGameMatching(game, payload);
                if (gameResult) {
                    winners.push(gameResult);
                }
            }

            // Update user tokens based on winners
            for (let winner of winners) {
                await User.updateOne(
                    { _id: winner.userId },
                    { $inc: { tokens: winner.points } }
                );
            }
            marketData.result = `${results(open, close)}`;

            // Save market data
            if (!existingResult) {
                await newResult.save();
            }
            await marketData.save();

            console.log(winners);
            return newResult;
        } else {
            return marketData;
        }
        // Handle open and close values

    } catch (error) {
        throw new Error(error.message);
    }
}


