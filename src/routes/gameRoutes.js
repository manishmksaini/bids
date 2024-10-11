import express from 'express';
import GameModel from '../models/gameModel.js';
import UserModel from '../models/userModel.js';
import mongoose from 'mongoose';
import Settings from '../models/settingModel.js';
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;
router.post('/', async (req, res) => {
    try {
        if (!req.body.userID) {
            return res.status(400).send({
                message: "User ID is required"
            });
        }
        if (!req.body.marketId) {
            return res.status(400).send({
                message: "Market id is required"
            });
        }
        if (!req.body.date) {
            return res.status(400).send({
                message: "Date is required"
            });
        }

        const userExists = await UserModel.findById(req.body.userID);
        if (!userExists) {
            return res.status(400).send({
                message: "User does not exist"
            });
        }
        const tokenBalance = userExists.tokens - req.body.total
        const settings = await Settings.findOne()
        if (req.body.total < settings.minBidAmount) {
            return res.status(400).send({
                message: `minimum ${settings.minBidAmount} points required`
            });
        }
        if (tokenBalance < 0) {
            return res.status(400).send({
                message: "Insufficient balance"
            });
        }
        await UserModel.findByIdAndUpdate(req.body.userID, { tokens: tokenBalance })

        const game = new GameModel(req.body);
        await game.save();
        res.status(200).send({
            message: "Game created successfully",
            game: game
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Error creating game",
            error: error
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const games = await GameModel.find({});
        res.status(200).send({
            message: "Games retrieved successfully",
            games: games
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Error retrieving games",
            error: error
        });
    }
});


// get by id 
// router.get('/:id', async (req, res) => {
//     try {
//         const game = await GameModel.findById(req.params.id);
//         res.status(200).send({
//             message: "Game retrieved successfully",
//             game: game
//         });
//     }
//     catch (error) {
//         res.status(500).send({
//             message: "Error retrieving game",
//             error: error
//         });
//     }
// });

//game history using game name, type and date 


router.get('/history', async (req, res) => {
    try {
        const user = req.query.userID;

        // Check if userID is provided
        if (!user) {
            return res.status(400).send({
                message: "User ID is required"
            });
        }

        // Validate and convert userID to ObjectId
        if (!ObjectId.isValid(user)) {
            return res.status(400).send({
                message: "Invalid User ID format"
            });
        }

        const userIdObject = new ObjectId(user);

        // Build the query object
        let query = {
            userID: userIdObject
        };

        // Add optional query parameters if they exist
        if (req.query.marketName) {
            query.marketName = req.query.marketName;
        }

        if (req.query.date) {
            query.date = req.query.date;
        }

        if (req.query.type) {
            query[req.query.type] = { $exists: true, };
        }

        // Query the games with the constructed query object
        const games = await GameModel.find(query).select([req.query.type, 'date', "open"]);
        const filteredGames = games.filter(game => game[req.query.type] && game[req.query.type]?.length > 0);
        res.status(200).send({
            message: "Games retrieved successfully",
            games: filteredGames
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving games",
            error: error
        });
    }
});


// get by userID
router.get('/user/:id', async (req, res) => {
    try {
        const games = await GameModel.find({ userID: req.params.id });
        res.status(200).send({
            message: "Games retrieved successfully",
            games: games
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Error retrieving games",
            error: error
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await GameModel.findByIdAndUpdate
            (req.params.id, req.body);
        res.status(200).send({
            message: "Game updated successfully"
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Error updating game",
            error: error
        });
    }
}
);

router.delete('/:id', async (req, res) => {
    try {
        await GameModel.findByIdAndDelete(req.params.id);
        res.status(200).send({
            message: "Game deleted successfully"
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Error deleting game",
            error: error
        });
    }
});

export default router;
