import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweets.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body

    if (content.trim == '') {
        throw new ApiError(400, "Tweet can't be empty")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    if (!tweet) {
        throw new ApiError(500, "Tweet not created")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "Tweet created successfully")
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const tweet = await Tweet.find({ owner: userId });

    if (!tweet) {
        throw new ApiError(500, "Tweet not found from this user")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "User all tweets fetched successfully")
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}