// server/api/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

function ensureCloudinaryConfigured() {
    // if already configured (api_key present), skip
    if (cloudinary.configured) return;

    const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
    const CLOUD_NAME = process.env.CLOUD_NAME;
    const CLOUD_KEY = process.env.CLOUD_KEY;
    const CLOUD_SECRET = process.env.CLOUD_SECRET;

    // Prefer CLOUDINARY_URL if available
    if (CLOUDINARY_URL) {
        cloudinary.config(CLOUDINARY_URL);
    } else {
        cloudinary.config({
            cloud_name: CLOUD_NAME,
            api_key: CLOUD_KEY,
            api_secret: CLOUD_SECRET,
            secure: true,
        });
    }

    // mark custom flag so we don't re-configure on subsequent calls
    cloudinary.configured = true;

    // debug log (do NOT commit this in production)
    console.log("Cloudinary configured:", {
        CLOUDINARY_URL: !!CLOUDINARY_URL,
        CLOUD_NAME: !!CLOUD_NAME,
        CLOUD_KEY: !!CLOUD_KEY,
        CLOUD_SECRET: !!CLOUD_SECRET,
    });
}

/**
 * uploadBufferToCloudinary(buffer, folder)
 * - uploads an in-memory Buffer to Cloudinary using upload_stream
 * - returns { url, public_id }
 */
export function uploadBufferToCloudinary(buffer, folder = "rems_listings") {
    return new Promise((resolve, reject) => {
        try {
            // defensive checks
            if (!buffer || !Buffer.isBuffer(buffer)) {
                return reject(new Error("uploadBufferToCloudinary: expected a Buffer"));
            }

            // ensure cloudinary is configured with current env values
            ensureCloudinaryConfigured();

            const opts = { folder };
            const uploadStream = cloudinary.uploader.upload_stream(opts, (err, result) => {
                if (err) {
                    return reject(new Error("Cloudinary upload failed: " + (err.message || JSON.stringify(err))));
                }
                if (!result || !result.secure_url || !result.public_id) {
                    return reject(new Error("Cloudinary returned unexpected result: " + JSON.stringify(result)));
                }
                return resolve({ url: result.secure_url, public_id: result.public_id });
            });

            streamifier.createReadStream(buffer).pipe(uploadStream);
        } catch (err) {
            reject(new Error("uploadBufferToCloudinary failed: " + (err.message || String(err))));
        }
    });
}

export { cloudinary };
