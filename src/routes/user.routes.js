import { Router } from "express";
import { loggedOut, loginUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js"
import { VerifyJWT } from "../middleware/auth.middleware.js";


const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

userRouter.route("/login").post(loginUser)

userRouter.route("/logout").post(VerifyJWT, loggedOut)
userRouter.route("/refresh-token").post(refreshAccessToken)

export { userRouter }