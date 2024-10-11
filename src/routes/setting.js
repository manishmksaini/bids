import express from 'express';
import Setting from '../models/settingModel.js';
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const { id, minBidAmount, maxBidAmount, welcomeBonus, mobileNumber, whatsapp } = req.body;

        // Check if required fields are present
        if (!minBidAmount || !maxBidAmount || !welcomeBonus || !mobileNumber || !whatsapp) {
            return res.status(400).send({
                message: "All fields are required"
            });
        }

        // Prepare data to update or insert
        const updateData = {
            minBidAmount,
            maxBidAmount,
            welcomeBonus,
            mobileNumber,
            whatsapp
        };

        // Find existing setting by id and update or create new if not found
        let setting;
        if (id) {
            setting = await Setting.findOneAndUpdate(
                { _id: id },
                { $set: updateData },
                { upsert: true, new: true }
            );
        } else {
            setting = new Setting(updateData);
            await setting.save();
        }

        if (setting) {
            return res.status(200).send({
                message: 'Updated successfully'
            });
        } else {
            return res.status(500).send({
                message: 'Error updating or creating setting'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            message: 'Internal server error'
        });
    }
});
router.get('/', async (req, res) => {
    try {
        const settings = await Setting.findOne()
        if (settings) {
            res.status(200).send(settings)
        }
    } catch (error) {
        res.status(500).send(error)
    }

})

export default router;
