import { Router } from "express";
import {toggleSubscription, getUserChannelSubscribers, getSubscribedChannels} from "../controllers/subscription.controller.js"
import { VerifyJWT } from "../middleware/auth.middleware.js"

const subscriptionRouter = Router()
subscriptionRouter.use(VerifyJWT)

subscriptionRouter.route("/toggleSubscription/:channelId").post(toggleSubscription)
subscriptionRouter.route("/NumberOfSubscriber/:channelId").get(getUserChannelSubscribers)
subscriptionRouter.route("/ChannelSubscribed/:subscriberId").get(getSubscribedChannels)


export {subscriptionRouter}