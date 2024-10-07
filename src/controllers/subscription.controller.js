import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription

    let responseToBeGiven = '';

    async function Unsubscribe(channelId) {
        await Subscription.findOneAndDelete({
            Subscriber: req.user._id,
            Channel: channelId
        })
    }

    async function subscribe(channelId) {
        const subscription = await Subscription.create(
            {
                Subscriber: req.user._id,
                Channel: channelId
            }
        )
        if (!subscription) {
            throw new ApiError(404, "Subscription not done")
        }
    }

    const alreadySubcribeOrNot = await Subscription.find({
        Subscriber: req.user._id,
        Channel: channelId
    })

    if (alreadySubcribeOrNot.length == 0) {
        subscribe(channelId)
        responseToBeGiven = 'Channel Successfully Subscribed'
    } else {
        Unsubscribe(channelId)
        responseToBeGiven = 'Channel Successfully Unsubscribed'
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, responseToBeGiven, "Subscription toggled successfully")
        )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, 'Invalid channel id')
    }

    const subscription = await Subscription.find({ Channel: channelId }).select('Subscriber');

    if (!subscription) {
        throw new ApiError(500, "Channel not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, subscription, 'Number of subscriber fetched successfully')
        )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, 'Invalid channel id')
    }

    const subscription = await Subscription.find({ Subscriber: subscriberId }).select('Channel');

    if (!subscription) {
        throw new ApiError(500, "Channel not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, subscription, 'Channel subscribed fetched successfully')
        )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}