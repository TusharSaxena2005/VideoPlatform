import mongoose, { isValidObjectId } from "mongoose"
import { Likes } from "../models/likes.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video

    let toggleResponse = ''

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    async function videoUnLike(videoId) {
        await Likes.deleteOne({
            video: videoId,
            likedBy: req.user._id
        })
    }

    async function videoLike(videoId) {
        await Likes.create({
            video: videoId,
            likedBy: req.user._id
        })
    }

    const alreadyLikedOrNot = await Likes.find({
        video: videoId,
        likedBy: req.user._id
    })

    if (alreadyLikedOrNot.length == 0) {
        videoLike(videoId)
        toggleResponse = 'Video Successfully Liked'
    }
    else {
        videoUnLike(videoId)
        toggleResponse = 'Video Successfully UnLiked'
    }


    return res
        .status(200)
        .json(
            new ApiResponse(200, toggleResponse, "Video like toggled successfully")
        )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment

    let toggleResponse = ''

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    async function commentUnLike(commentId) {
        await Likes.deleteOne({
            comment: commentId,
            likedBy: req.user._id
        })
    }

    async function commentLike(commentId) {
        await Likes.create({
            comment: commentId,
            likedBy: req.user._id
        })
    }

    const alreadyLikedOrNot = await Likes.find({
        comment: commentId,
        likedBy: req.user._id
    })

    if (alreadyLikedOrNot.length == 0) {
        commentLike(commentId)
        toggleResponse = 'Comment Successfully Liked'
    }
    else {
        commentUnLike(commentId)
        toggleResponse = 'Comment Successfully UnLiked'
    }


    return res
        .status(200)
        .json(
            new ApiResponse(200, toggleResponse, "Comment like toggled successfully")
        )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet

    let toggleResponse = ''

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    async function tweetUnLike(tweetId) {
        await Likes.deleteOne({
            tweet: tweetId,
            likedBy: req.user._id
        })
    }

    async function tweetLike(tweetId) {
        await Likes.create({
            tweet: tweetId,
            likedBy: req.user._id
        })
    }

    const alreadyLikedOrNot = await Likes.find({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if (alreadyLikedOrNot.length == 0) {
        tweetLike(tweetId)
        toggleResponse = 'tweet Successfully Liked'
    }
    else {
        tweetUnLike(tweetId)
        toggleResponse = 'tweet Successfully UnLiked'
    }


    return res
        .status(200)
        .json(
            new ApiResponse(200, toggleResponse, "tweet like toggled successfully")
        )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const LikedVideos = await Likes.find({
        likedBy: req.user._id,
        comment: null,
        tweet: null
    }).select('video likedBy')

    if (!LikedVideos) {
        throw new ApiError(500, "Liked videos not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, LikedVideos, "Videos liked by user fetched successfully")
        )
})

const getLikedComments = asyncHandler(async (req, res) => {
    //TODO: get all liked comments

    const LikedComments = await Likes.find({
        likedBy: req.user._id,
        video: null,
        tweet: null
    }).select('comment likedBy')

    if (!LikedComments) {
        throw new ApiError(500, "Liked comments not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, LikedComments, "Comments liked by user fetched successfully")
        )
})

const getLikedTweets = asyncHandler(async (req, res) => {
    //TODO: get all liked Tweets

    const LikedTweets = await Likes.find({
        likedBy: req.user._id,
        video: null,
        comment: null
    }).select('tweet likedBy')

    if (!LikedTweets) {
        throw new ApiError(500, "Liked Tweets not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, LikedTweets, "Tweets liked by user fetched successfully")
        )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikedComments,
    getLikedTweets
}