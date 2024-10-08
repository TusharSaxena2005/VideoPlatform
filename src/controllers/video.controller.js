import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { cloudnaryUpload, cloudnaryDelete, cloudnaryDeleteVideo } from "../utils/cloudnary.js"


function deleteFromCloud(link) {
    let urlSeperator = []
    let url = link
    let urlWord = ''
    for (let i = 0; i < url.length; i++) {
        if (url[i] == '/') {
            urlSeperator.push(urlWord)
            urlWord = ''
        }
        else if (url[i] == '.') {
            urlSeperator.push(urlWord)
        }
        else {
            urlWord += url[i]
        }
    }

    return urlSeperator[urlSeperator.length - 1]
}


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 1, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const offset = (page - 1) * limit
    const video = await Video.find({ owner: userId, title: sortBy }).skip(offset).limit(limit);

    if (!video) {
        throw new ApiError(404, "Video not found");
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
        owner: req.user?._id
    })

    if (!video) {
        throw new ApiError(500, "Video not published")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video published successfully")
        )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video id")
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid video ID"));
    }

    const video = await Video.findById(videoId);

    if (!video) {
        return res.status(404).json(new ApiResponse(404, null, "Video not found"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video found")
        );
})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
    const { videoId } = req.params;
    const { title, description } = req.body;
    const thumbnailLocalPath = req.file?.path;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video id")
    }

    if (!title && !description && !thumbnailLocalPath) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    if (!(title || description)) {
        throw new ApiError(400, "No fields to update")
    }

    let video;

    if (thumbnailLocalPath) {

        video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(400, "Video not found")
        }

        try {
            await cloudnaryDelete(deleteFromCloud(video.thumbnail))

        } catch (error) {

            throw new ApiError(500, "Failed to delete old thumbnail")
        }

        try {
            const thumbnail = await cloudnaryUpload(thumbnailLocalPath)
            video = await Video.findByIdAndUpdate(
                videoId,
                {
                    $set: {
                        title,
                        description,
                        thumbnail: thumbnail.url
                    }
                },
                {
                    new: true
                }
            );

        } catch (error) {
            throw new ApiError(500, "Failed to upload new thumbnail")
        }


    } else {
        video = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    title,
                    description
                }
            },
            {
                new: true
            }
        );
    }

    if (!video) {
        throw new ApiError(500, "Data not updated");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video details updated")
        );
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video id")
    }

    const video = await Video.findById(videoId)

    try {
        await cloudnaryDeleteVideo(deleteFromCloud(video.videoFile))
        await cloudnaryDelete(deleteFromCloud(video.thumbnail))

    } catch (error) {

        throw new ApiError(500, "Failed to delete old thumbnail")
    }

    try {
        await Video.deleteOne({ _id: videoId })
    } catch (error) {
        throw new ApiError(500, "Video not deleted")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Video deleted successfully")
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video id")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "Video not found")
    }

    function isPublished(x) {
        if (x == true) {
            x = false;
        } else {
            x = true;
        }

        return x;
    }

    const updatePublishStatus = await Video.findByIdAndUpdate(videoId,
        {
            $set: {
                isPublished: isPublished(video.isPublished)
            }
        },
        {
            new: true
        }
    )

    if (!updatePublishStatus) {
        throw new ApiError(400, "Video status not changed")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatePublishStatus, "Public status toggled")
        )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}