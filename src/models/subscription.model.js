import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    Subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    Channel: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

export const Subscription = mongoose.model("Subscription", subscriptionSchema);