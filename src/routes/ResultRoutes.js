import express from 'express';
import generateResult from '../controller/resultController.js';
import result from '../models/resultModel.js';
import market from '../models/marketModel.js';
import mongoose from 'mongoose';
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        if (req.query.marketid) {
            const results = await result.find({marketId:new mongoose.Types.ObjectId(req.query.marketid)}).select(['open','close','date']);
            return res.status(200).json({ message: 'Markets fetched successfully', data: results });
        }
        if (req.query.name) {
            let query = {};
            query.date = { $regex: req.query.date, $options: 'i' };
            const results = await result.find(query);
            return res.status(200).json({ message: 'Markets fetched successfully', data: results });
        }
        const results = await result.find().populate('marketId');
        return res.status(200).json({ message: 'Results fetched successfully', data: results });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
);

router.post('/', async (req, res) => {
    console.log(req.body);
    try {
        const { body } = req;
        const { date, marketId, open, close } = body;
        if (!date || !marketId) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }
        const resultData = { date, marketId };

        if (open !== undefined) {
            resultData.open = open;
        }

        if (close !== undefined) {
            resultData.close = close;
        }

        const newResult = await generateResult(resultData);

        return res.status(201).json({ message: 'Result created successfully', data: newResult });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    console.log(req.body);
    try {
        const { body } = req;
        const { date } = body;
        if (!date) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }
        const updatedResult = await generateResult(body);
        return res.status(200).json({ message: 'Result updated successfully', data: updatedResult });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { marketId } = req.query;
        if (!marketId) {
            return res.status(400).json({ message: 'Market ID not found' });
        }

        // Find the market by ID and update it
        const Market = await market.findById(marketId);
        if (!Market) {
            return res.status(404).json({ message: 'Market not found' });
        }

        // Example of updating the Market
        // Adjust the update fields as needed
        Market.result = '***_**_***';
        await Market.save();

        // Delete the result by ID
        const deletedResult = await result.findByIdAndDelete(req.params.id);
        if (!deletedResult) {
            return res.status(404).json({ message: 'Result not found' });
        }

        return res.status(200).json({ message: 'Result deleted successfully', data: deletedResult });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
});



export default router;