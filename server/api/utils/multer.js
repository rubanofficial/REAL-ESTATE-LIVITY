// server/api/utils/multer.js
import multer from "multer";

// memory storage so we can access file.buffer and upload to Cloudinary directly
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        cb(new Error("Only image files are allowed"), false);
    } else {
        cb(null, true);
    }
};

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

export default multer({ storage, fileFilter, limits });
