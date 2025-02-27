const fileModel = require("../Models/fileModel");

const fileController = async (req, res) => {
    try {
        const filename = req.params.filename;
        const response = await fileModel(filename);
        if(response.filePath === undefined || response.fileName === undefined) throw new Error(response.body.message);
        res.download(response.filePath, response.fileName, (err) => {
            if (err) {
                console.error("File download error:", err);
                res.status(500).send("Error downloading file");
            }
        })
    } catch (err) {
        console.error("Error downloading file:", err);
        res.status(500)
           .json({ error: "Server error" });
    }
}

module.exports = fileController;