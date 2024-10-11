import express from 'express';
import Markets from '../models/marketModel.js';
const router = express.Router();


//create new market
router.post('/', async (req, res) => {
    try {
        const { name, open, close, isActive } = req.body
        if (!name || !open || !close) {
            return res.status(400).json({ message: 'Please enter all fields [name,open,close,isActive]' });
        }
        const bidExist = await Markets.findOne({ name: name });
        if (bidExist) {
            return res.status(400).json({ message: 'Market already exist' });
        }
        const bid = new Markets({ name, open, close, isActive });
        await bid.save();
        return res.status(200).json({ message: 'Market Created Successfully', data: bid });
    }
    catch (error) {
        res.status(500).json(error)
    }
});

//update market
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(400).json({ message: 'Please enter all fields [name]' });
        }
        const bid = await Markets.findByIdAndUpdate(req.params.id, {
            ...req.body
        });
        return res.status(200).json({ message: 'Market Updated Successfully', data: bid });
    }
    catch (error) {
        if (error.code == 11000) {
            return res.status(400).json({ message: 'Market already exist' });
        }
        res.status(400).json({ message: "server error" })
    }
}
);

//get all market
router.get('/', async (req, res) => {
    try {
        if (req.query.name) {
            let query = {};
            query.name = { $regex: req.query.name, $options: 'i' };
            const markets = await Markets.find(query);
            return res.status(200).json({ message: 'Markets fetched successfully', data: markets });
        }
        const markets = await Markets.find();
        return res.status(200).json({ message: 'Markets fetched successfully', data: markets });
    }
    catch (error) {
        res.status(400).json({ message: "server error ", error })
    }
});

//get single market
router.get('/:id', async (req, res) => {
    try {
        const bid = await Markets.findById(req.params.id);
        return res.status(200).json({ message: 'Bid fetched successfully', data: bid });
    }
    catch (error) {
        res.status(400).json({ message: "server error" })
    }
});

//delete market
router.delete('/:id', async (req, res) => {
    try {
        const bid = await Markets.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Bid deleted successfully', data: bid });
    }
    catch (error) {
        res.status(400).json({ message: "server error" })
    }
});
export default router;
