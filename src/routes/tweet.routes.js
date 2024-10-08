import { Router } from "express";
import { createTweet, getUserTweets, updateTweet, deleteTweet } from "../controllers/tweet.controller.js";
import { VerifyJWT } from "../middleware/auth.middleware.js"

const tweetRouter = Router()
tweetRouter.use(VerifyJWT)

tweetRouter.route("/createTweet/").post(createTweet)
tweetRouter.route("/UserTweets/:userId").get(getUserTweets)
tweetRouter.route("/updateTweet/:tweetId").patch(updateTweet)
tweetRouter.route("/deleteTweet/:tweetId").get(deleteTweet)


export { tweetRouter }