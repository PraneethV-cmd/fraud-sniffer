const multer = require("multer");
const path = require("path");
const fs = require("fs");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir = "uploads";
        if(req.params.assignmentID !== undefined){
            uploadDir = `uploads/${req.params.assignmentID}`;
        }
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, ""); 
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${safeName}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx", ".zip"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("File type not allowed! Only PDF, DOC, DOCX, and ZIP are permitted."), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB size limit
    }
});

module.exports = upload;

