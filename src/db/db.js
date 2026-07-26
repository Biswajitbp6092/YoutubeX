import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

console.log("DB_NAME", DB_NAME);
console.log("DATABASE_URL", process.env.DATABASE_URL);


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URL}`);
        console.log(`MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("database connection Failed ", error);
        process.exit(1);
    }

}

export default connectDB;