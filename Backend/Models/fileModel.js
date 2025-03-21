const path = require("path");
const fs = require("fs");

const response = {
    fileName: undefined,
    filePath: undefined,
    statusCode: 503,
    body:{
        message: ""
    }
}

const fileModel = async(fileName, folderPath) => {
    const uploadDir = path.join(__dirname, `../uploads${folderPath !== "root" ? `/${folderPath}` : ""}`);

    const filePath = path.join(uploadDir, fileName);
    
    if (fs.existsSync(filePath)) {
        response.fileName = fileName;
        response.filePath = filePath;
        response.statusCode = 200;
        
    } else {
        response.body.message = "File not found at path:"+ filePath;
        response.statusCode = 404;
        console.error("File not found at path:", filePath);
    }
    return response;
}

module.exports = fileModel;


// Route to list all uploaded files

// router.get("/files", (req, res) => {
//     fs.readdir(uploadDir, (err, files) => {
//         if (err) {
//             console.error("Error reading directory:", err);
//             return res.status(500).json({ error: "Error reading directory" });
//         }
//         console.log("Files in uploadDir:", files);
//         res.json({ files });
//     });

// });