import { Router } from "express"
import { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist } from "../controllers/playlist.controller.js"
import { VerifyJWT } from "../middleware/auth.middleware.js"

const playlistRouter = Router();
playlistRouter.use(VerifyJWT);

playlistRouter.route("/createPlaylist").post(createPlaylist)
playlistRouter.route("/userPlaylists/:userId").get(getUserPlaylists)
playlistRouter.route("/playlistById/:playlistId").get(getPlaylistById)
playlistRouter.route("/addVideoToPlaylist/:playlistId/:videoId").post(addVideoToPlaylist)
playlistRouter.route("/removeVideoFromPlaylist/:playlistId/:videoId").post(removeVideoFromPlaylist)


export { playlistRouter }