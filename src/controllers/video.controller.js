import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { cloudnaryUpload, cloudnaryDelete } from "../utils/cloudnary.js"
import { query } from "express";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 1, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const offset = (page - 1) * limit
    const video = await Video.find({ owner: userId, title: sortBy }).skip(offset).limit(limit);

    if(!video){
        return new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "All videos created by this owner fetched")
        )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video

    if ([title, description].some((field) => field?.trim === "")) {
        throw new ApiError(400, "All fields are required")
    }


    const user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(400, "User not found")
    }



    const videoFileLocalPath = req.files?.videoFile[0].path;
    const thumbnailLocalPath = req.files?.thumbnail[0].path;


    if (!videoFileLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video file and Thumbnail required")
    }

    const videoFile = await cloudnaryUpload(videoFileLocalPath);
    const thumbnail = await cloudnaryUpload(thumbnailLocalPath);

    if (!videoFile || !thumbnail) {
        throw new ApiError(500, "Video or thumbail not uploaded")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: user
    })

    const videoPublished = await Video.findById(video._id)

    if (!videoPublished) {
        throw new ApiError(500, "Video not published")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, videoPublished, "Video published successfully")
        )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById(videoId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "Video found")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}