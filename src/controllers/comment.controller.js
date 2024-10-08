import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const offset = (page - 1) * limit

    const comment = await Comment.find({ video: videoId }).skip(offset).limit(limit)

    if (!comment) {
        throw new ApiError(500, "Comment not fetched")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, comment, "All videos fetched successfully")
        )
})

const addComment = asyncHandler(async (req, res) => {
    const {videoId } = req.params
    const { comment } = req.body
    // TODO: add a comment to a video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid user or video id")
    }

    if (comment == "") {
        throw new ApiError(400, "Comment is empty")
    }

    const addComment = await Comment.create(
        {
            comment,
            video: videoId,
            owner: req.user._id
        }
    )

    if (!addComment) {
        throw new ApiError(500, "Comment not added")
    }


    return res
        .status(200)
        .json(
            new ApiResponse(200, addComment, "Comment successfully added")
        )
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { comment } = req.body
    // TODO: update a comment

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    if (comment == "") {
        throw new ApiError(400, "Comment is empty")
    }

    const updateComment = await Comment.findByIdAndUpdate(commentId,
        {
            $set: {
                comment
            }
        },
        {
            new: true
        }
    )

    if (!updateComment) {
        throw new ApiError(500, "Comment not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updateComment, "Comment updated successfully")
        )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    // TODO: delete a comment

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const comment = await Comment.deleteOne({ _id: commentId })

    if (!comment) {
        throw new ApiError(500, "Comment not deleted")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200,"Comment successfully deleted")
        )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}