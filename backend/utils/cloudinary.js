import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
export const extractPublicId = (cloudinaryUrl) => {
    if (!cloudinaryUrl) return null

    const parts = cloudinaryUrl.split("/upload/")
    if (parts.length < 2) return null

    const publicIdWithVersion = parts[1]
    const publicId = publicIdWithVersion
        .split("/")
        .slice(1)
        .join("/")
        .replace(/\.[^/.]+$/, "")

    return publicId
}
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}



export { uploadOnCloudinary, cloudinary }