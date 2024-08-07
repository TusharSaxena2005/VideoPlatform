import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB=async()=>{
    try {
        const connectionDB = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\nDatabase connected successfully !!! ${connectionDB.connection.host}`)
    } catch (error) {
        console.error("Database not connected",error);
        process.exit(1)
    }
}

export default connectDB