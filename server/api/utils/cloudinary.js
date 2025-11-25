// server/api/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
    secure: true,
});

/**
 * uploadBufferToCloudinary(buffer, folder)
 * - uploads an in-memory Buffer to Cloudinary using upload_stream
 * - returns { url, public_id }
 */
export function uploadBufferToCloudinary(buffer, folder = "rems_listings") {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
            if (err) return reject(err);
            resolve({ url: result.secure_url, public_id: result.public_id });
        });
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}

export { cloudinary };
