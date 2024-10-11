import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import moment from "moment-timezone"; // Update this line
import mongoose from "mongoose";
import v1Router from "./src/routes/index.js";
dotenv.config({ path: `.env` });

// Connect to MongoDB    //mongodb+srv://mrmk00341046:<db_password>@cluster0.1yhkfve.mongodb.net/
mongoose.connect(process.env.mongoDB || "mongodb+srv://mrmk00341046:mrmk00341046@cluster0.1yhkfve.mongodb.net/" + "bidGame", {   
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Failed to connect to MongoDB", error);
});
// console.log(process.env.mongoDB)

const app = express();

// CORS setup
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
};
app.use(cors(corsOptions));
// app.use(cors())


// Parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Compression
app.use(compression());

// Routes
app.use("/api/v1", v1Router);

// Handle all undeclared routes
app.all("*", (req, res) => {
    res.status(404).send({ errors: { message: "Requested Resource Not Exists", code: "404 Not Found" } });
});

import cron from 'node-cron';
import market from "./src/models/marketModel.js";

cron.schedule('* * * * *', async () => {
    try {
        const indiaTimezone = 'Asia/Kolkata';
        const now = moment().tz(indiaTimezone);
        const markets = await market.find();
        console.log(`Current time: ${now.format('YYYY-MM-DD HH:mm:ss')}`);
        for (const market of markets) {
            const openTime = moment("04:00 AM", 'hh:mm A').tz(indiaTimezone);
            const closeTime = moment(market.close, 'hh:mm A').tz(indiaTimezone);
            if (now.isBetween(openTime, closeTime)) {
                market.isActive = true;
            } else {
                market.isActive = false;
                market.result = '***_**_***';
            }

            await market.save();
        }

        console.log('Cron job executed successfully');
    } catch (error) {
        console.log(error)
    }
});

// Start the server ////process.env.PORT ? parseInt(process.env.PORT) : 
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
