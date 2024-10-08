import { Router } from "express";
import { getVideoComments, addComment, updateComment, deleteComment } from "../controllers/comment.controller.js"
import { VerifyJWT } from "../middleware/auth.middleware.js";

const commentRouter = Router()
commentRouter.use(VerifyJWT);

commentRouter.route("/addComment/:videoId").post(addComment)
commentRouter.route("/getVideoComments/:videoId").get(getVideoComments)
commentRouter.route("/updateComment/:commentId").patch(updateComment)
commentRouter.route("/deleteComment/:commentId").get(deleteComment)



export { commentRouter }