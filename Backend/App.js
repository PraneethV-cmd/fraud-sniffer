require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const multer = require("multer");
const fs = require("fs");
const stringSimilarity = require("string-similarity");
const natural = require("natural");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mainRouter = require("./mainRouter");
const upload = multer({ dest: "uploads/" });
const pool = require("./Database/createPool");

const { initDB } = require("./Database/initDB");

(async () => {
    try {
        console.log("[LOG]: Initializing the database schema.");
        await initDB();
    } catch (err) {
      console.error("[ERROR in App]: ", err);
    }
})();

app.use("/api", mainRouter);

//Test Router
app.use("/test", (req, res)=>{
    res.send("Hello World");
});

// Function to Read File Content
const readFile = (filePath) => fs.readFileSync(filePath, "utf8");

// Cosine Similarity Calculation
const cosineSimilarity = (text1, text2) => {
    const tokenizer = new natural.WordTokenizer();
    const words1 = tokenizer.tokenize(text1.toLowerCase());
    const words2 = tokenizer.tokenize(text2.toLowerCase());

    const tfidf = new natural.TfIdf();
    tfidf.addDocument(words1);
    tfidf.addDocument(words2);

    return tfidf.tfidf(0, 1); // Cosine similarity between doc 0 & 1
};

// API to Compare Two Files
app.post("/compare", upload.array("files", 2), async (req, res) => {
    if (req.files.length < 2) {
        return res.status(400).json({ error: "Upload exactly 2 documents." });
    }

    // Read files
    const text1 = readFile(req.files[0].path);
    const text2 = readFile(req.files[1].path);

    // Calculate Similarity Scores
    const similarityScore = stringSimilarity.compareTwoStrings(text1, text2);
    const cosineScore = cosineSimilarity(text1, text2);

    const similarityPercentage = (similarityScore * 100).toFixed(2) + "%";

    // Save to Database
    const result = await pool.query(
        "INSERT INTO plagiarism_reports (file1, file2, similarity) VALUES ($1, $2, $3) RETURNING *",
        [req.files[0].originalname, req.files[1].originalname, similarityPercentage]
    );

    res.json({
        similarity_percentage: similarityPercentage,
        cosine_similarity: cosineScore.toFixed(2),
        report_id: result.rows[0].id,
    });

    // Delete uploaded files
    fs.unlinkSync(req.files[0].path);
    fs.unlinkSync(req.files[1].path);
});

app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT);
});