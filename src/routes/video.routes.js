import { Router } from "express";
import { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus } from "../controllers/video.controller.js";
import { VerifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const videoRouter = Router();
videoRouter.use(VerifyJWT);


videoRouter.route("/getAllVideos").get(getAllVideos)
videoRouter.route("/publishAVideo").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
)
videoRouter.route("/getVideoById/:videoId").get(getVideoById)
videoRouter.route("/updateVideo/:videoId").patch(upload.single('thumbnail'), updateVideo);
videoRouter.route("/deleteVideo/:videoId").get(deleteVideo);
videoRouter.route("/togglePublishStatus/:videoId").patch(togglePublishStatus);




export { videoRouter }  