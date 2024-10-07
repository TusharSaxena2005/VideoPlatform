import { Router } from "express";
import { createTweet, getUserTweets, updateTweet, deleteTweet } from "../controllers/tweet.controller.js";
import { VerifyJWT } from "../middleware/auth.middleware.js"

const tweetRouter = Router()
tweetRouter.use(VerifyJWT)

tweetRouter.route("/createTweet/").post(createTweet)
tweetRouter.route("/UserTweets/:userId").get(getUserTweets)


export { tweetRouter }