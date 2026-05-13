import mongoose from "mongoose";
import { serverConfig } from ".";
import logger from "./logger.config";

export const connectDB = async () => {
    try {
        const dbUrl = serverConfig.DB_URL
        await mongoose.connect(dbUrl);
        logger.info("Connected to mongodb successfully");
        console.log("Connected to db")
        mongoose.connection.on("error", (error) => {
            logger.error("MongoDB connection error", error);
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected");
        });

         process.on("SIGINT", async () => {
            await mongoose.connection.close();
            logger.info("MongoDB connection closed");
            process.exit(0);
        })


    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with an error code
    }
}