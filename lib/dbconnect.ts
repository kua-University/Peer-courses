import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;


let isConnected = 0; // Track connection status

export default async function dbConnect(): Promise<Connection | undefined>
{
    if (isConnected)
    {
        console.log("Using existing MongoDB connection");
        return;
    }

    try
    {
        if (!MONGODB_URI)
        {
            throw new Error("Please define the MONGODB_URI environment variable");
        }

        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB");
    } catch (error)
    {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}
