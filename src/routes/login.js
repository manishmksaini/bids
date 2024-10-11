import express from 'express';
import Admin from '../models/adminModel.js';
const router = express.Router();

router.post('/', async (req, res) => { 
    try {
        const { mobile, password } = req.body
        if (!mobile || !password) {
            return res.status(402).send({
                message: 'Please provide all fields'
            })
        }
        const user = await Admin.findOne({ mobileNumber: mobile })
        if (user) {
            if (user.password === password) {
                return res.status(200).send({
                    message: 'login success'
                })
            }
            else {
                return res.status(302).send({
                    message: 'check your credentials'
                })
            }
        }
        else {
            res.status(302).send({
                message: 'check your credentials'
            })

        }
    } catch (error) {
        res.status(500).send(error)
    }

})
router.put('/', async (req, res) => {
    try {
        const { mobileNumber, password } = req.body
        if (!mobileNumber || !password) {
            return res.status(402).send({
                message: 'Please provide all fields'
            })
        }
        const user = new Admin(req.body);
        await user.save();
        res.send('created')
    } catch (error) {
        res.status(500).send(error)
    }

})

export default router;
