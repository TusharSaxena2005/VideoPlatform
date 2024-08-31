import { v2 as cloudinary } from "cloudinary"
import { response } from "express";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const cloudnaryUpload = async (localPath) => {
    try {
        if (!localPath) return
        cloudinary.uploader.upload(
            localPath,
            {
                resource_type: "auto",
            }
        )
        console.log("File has been uploaded on Cloudnary successfully", response.url);
        return response;
    } catch (error) {
        fs.unlink(localPath);
        return null;
    }
}


export { cloudnaryUpload }
