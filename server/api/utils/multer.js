// server/api/utils/multer.js
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
        cb(new Error("Only image files are allowed"), false);
    } else {
        cb(null, true);
    }
};

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

const upload = multer({ storage, fileFilter, limits });

export default upload;
