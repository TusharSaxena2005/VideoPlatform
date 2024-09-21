import { Router } from "express";
import { loggedOut, loginUser, registerUser, refreshAccessToken, changePassword, getCurrentUser, updateAccount, updateUserAvatar, getChannelProfile, userWatchHistory, updateUserCoverImage } from "../controllers/user.controller.js";
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
userRouter.route("/change-password").post(VerifyJWT, changePassword)
userRouter.route("/current-user").get(VerifyJWT, getCurrentUser)
userRouter.route("/update-account").patch(VerifyJWT, updateAccount)
userRouter.route("/update-user-avatar").patch(VerifyJWT, upload.single("avatar"), updateUserAvatar)
userRouter.route("/update-user-coverImage").patch(VerifyJWT, upload.single("coverImage"), updateUserCoverImage)
userRouter.route("/channel/:username").get(VerifyJWT, getChannelProfile)
userRouter.route("/watchHistory").get(VerifyJWT, userWatchHistory)

export { userRouter }