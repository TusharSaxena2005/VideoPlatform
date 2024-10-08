import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js"
import { VerifyJWT } from "../middleware/auth.middleware.js";

const dashboardRouter = Router()
dashboardRouter.use(VerifyJWT)



export { dashboardRouter }