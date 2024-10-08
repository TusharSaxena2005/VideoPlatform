import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js"
import { VerifyJWT } from "../middleware/auth.middleware.js";

const dashboardRouter = Router()
dashboardRouter.use(VerifyJWT)

dashboardRouter.route("/channelStats").get(getChannelStats)
dashboardRouter.route("/channelVideos").get(getChannelVideos)



export { dashboardRouter }