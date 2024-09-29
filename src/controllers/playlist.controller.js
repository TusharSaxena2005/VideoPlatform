import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    //TODO: create playlist 

    if ([name, description].some((field) => field?.trim === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const playlist = await Playlist.create(
        {
            name,
            description,
            owner: req.user?._id
        }
    )

    if (!playlist) {
        throw new ApiError(500, "playlist not created")
    }


    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist created successfully")
        )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const playlist = await Playlist.find({ owner: userId })

    if (!playlist) {
        throw new ApiError(500, "User not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "User playlist fetched")
        )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(500, "playlist not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist fetched successfully")
        )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $addToSet: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    if (!playlist) {
        throw new ApiError(500, "Video not added")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Video successfully added to playlist")
        )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist id or video id");
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $pull: {
                videos: videoId
            }
        }
    );

    if (!playlist) {
        throw new ApiError(400, "Video not removed");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video successfully removed from playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete 

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if (!playlist) {
        throw new ApiError(500, "Playlist not deleted")
    }


    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist deleted successfully")
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    if (!name && !description) {
        throw new ApiError(400, "name or description not provided")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {
            new:true
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist details updated")
        )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}