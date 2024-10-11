import express from 'express';
import Password from '../helper/passwordHashing.js';
import User from '../models/userModel.js';
const router = express.Router();
// router.post('/verify/email', verifyEmail);
import Setting from '../models/settingModel.js';

router.post('/login', async (req, res) => { 
    const { mobileNumber, password } = req.body;
    if (!mobileNumber || !password) {
        return res.status(400).json({ message: 'Please enter all fields [mobileNumber,password]' });
    }
    try {
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await Password.comparePasswords(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const settings = await Setting.find()
        return res.status(200).json({ message: 'User logged in successfully', data: { user, settings: settings } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
);

router.put('/changePassword', async (req, res) => {
    const { mobileNumber, oldPassword, newPassword } = req.body;
    if (!mobileNumber || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Please enter all fields [mobileNumber,oldPassword,newPassword]' });
    }
    try {
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await Password.comparePasswords(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const hashedPassword = await Password.hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message: 'Password changed successfully', data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
);


// user routers

//create new user
router.post('/user', async (req, res) => {
    const { name, password, mobileNumber, tokens } = req.body;
    console.log(name, password, mobileNumber, tokens )
    if (!name || !password || !mobileNumber) {
        return res.status(400).json({ message: 'Please enter all fields [name,password,mobileNumber]' });
    }
    try {
        const userExists = await User.findOne({ mobileNumber: mobileNumber });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const settings = await Setting.find()

        const hashedPassword = await Password.hashPassword(password);
        const user = new User({
            name: name,
            mobileNumber: mobileNumber,
            password: hashedPassword,
            tokens: tokens || settings.welcomeBonus
        });
        await user.save();
        return res.status(200).json({ message: 'User Created Successfully', data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

//update user
router.put('/:id', async (req, res) => {
    const { name, password, mobileNumber } = req.body;
    if (!name || !password || !mobileNumber) {
        return res.status(400).json({ message: 'Please enter all fields [name,password,mobileNumber]' });
    }
    try {
        if (req.body.password) {
            const hashedPassword = await Password.hashPassword(req.body.password);
            req.body.password = hashedPassword;
        }
        const user = await User.findByIdAndUpdate(req.params.id, {
            ...req.body
        });
        return res.status(200).json({ message: 'User Updated Successfully', data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
);

//delete user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'User Deleted Successfully', data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
);

//get all users
router.get('/', async (req, res) => { 
    try { 
        if (req.query.name.length) {
            let query = {};
            query.name = { $regex: req.query.name, $options: 'i' };
            const users = await User.find(query).select('-password');
            return res.status(200).json({ data: users });
        }
        const users = await User.find().select('-password');
        return res.status(200).json({ data: users });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

//get single user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...data } = user._doc;
        return res.status(200).json({ data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
