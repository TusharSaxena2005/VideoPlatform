import { Router } from "express"
import { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos, getLikedComments, getLikedTweets } from "../controllers/like.controller.js"
import { VerifyJWT } from "../middleware/auth.middleware.js"


const likeRouter = Router()
likeRouter.use(VerifyJWT)

likeRouter.route("/videoLike/:videoId").post(toggleVideoLike)
likeRouter.route("/commentLike/:commentId").post(toggleCommentLike)
likeRouter.route("/tweetLike/:tweetId").post(toggleTweetLike)
likeRouter.route("/likedVideos/").get(getLikedVideos)
likeRouter.route("/likedComments/").get(getLikedComments)
likeRouter.route("/likedTweets/").get(getLikedTweets)


export { likeRouter }