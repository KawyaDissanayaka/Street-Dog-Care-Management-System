const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage destination and filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Store files in the backend/uploads/ directory
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate a secure, unique filename: timestamp + random number + original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, 'dog-' + uniqueSuffix + ext);
    }
});

// File filter function to reject non-image files
const fileFilter = (req, file, cb) => {
    // Allowed extensions and MIME types
    const allowedExtensions = /jpeg|jpg|png|webp/;
    const allowedMimeTypes = /image\/jpeg|image\/jpg|image\/png|image\/webp/;

    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedMimeTypes.test(file.mimetype);

    if (extName && mimeType) {
        // Accept file
        cb(null, true);
    } else {
        // Reject file
        cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
    }
};

// Initialize multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB size limit
    }
});

// Create the middleware for uploading a single photo
const uploadDogPhoto = upload.single('photo');

module.exports = {
    uploadDogPhoto
};
