import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Likes } from "../models/likes.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const videos = await Video.find({ owner: req.user._id })

    if (!videos) {
        throw new ApiError(500, "Videos not found")
    }

    let numberOfVideos = videos.length

    const subscribers = await Subscription.find({ Channel: req.user._id })

    if (!subscribers) {
        throw new ApiError(500, "Videos not found")
    }

    let numberOfSubscribers = subscribers.length

    return res
        .status(200)
        .json(
            new ApiResponse(200, { "Number Of Videos": numberOfVideos, "Number of subscribers": numberOfSubscribers }, "Stats of this channel successfully fetched")
        )

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const videos = await Video.find({ owner: req.user._id }).select('videoFile thumbnail title description owner duration');

    if (!videos) {
        throw new ApiError(500, "videos not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "All videos uploaded by this user fetched successfully")
        )
})

export {
    getChannelStats,
    getChannelVideos
}