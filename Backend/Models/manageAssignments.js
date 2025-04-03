const dbPool = require("../Database/createPool");
const { v4: uuidv4 } = require("uuid");

const cryptoRandomString = require('crypto-random-string');


const response = {
    code: 503, 
    body: { 
        message: "" 
    } 
};

const manageAssignmentsModel = {
    get: async (assignmentID) => {
        const query = `SELECT * FROM assignments WHERE assignmentID = $1;`;

        try {
            const results = await dbPool.query(query, [assignmentID]);
            if (results.rowCount === 0) throw new Error("Not found");

            response.code = 200;
            response.body.message = results.rows;
        } catch (error) {
            response.code = error.message === "Not found" ? 404 : 500;
            response.body.message = error.message;
            console.error("[ERROR in manageAssignmentsModel.get]:", error);
        }

        return response;
    },

    create: async (...params) => {
        const joinCode = cryptoRandomString({ length: 6, type: 'alphanumeric' });
        

        const query = `
        INSERT INTO assignments (userID, title, description, startDate, endDate, difficulty, filename, originalFilename, filePath, fileType, fileSize, isZip, join_code)
        VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'no_file'), COALESCE($8, 'no_file'), COALESCE($9, ''), COALESCE($10, 'unknown'), COALESCE($11, 0), COALESCE($12, FALSE), $13);
        `;

        try {
            const paramsWithJoinCode = [...params, joinCode];
            await dbPool.query(query, paramsWithJoinCode);
            return manageAssignmentsModel.view(paramsWithJoinCode[0], "owner");
        } catch (error) {
            response.code = 500;
            response.body.message = error.message;
            console.error("[ERROR in manageAssignmentsModel.create]:", error);
        }

        return response;
    },

    update: async (assignmentID, title, description, startdate, enddate, difficulty) => {

        const query = `
        UPDATE assignments
        SET title = $1, description = $2, startDate = $3, endDate = $4, difficulty = $5
        WHERE assignmentID = $6
        RETURNING *;`;

        try {
            const results = await dbPool.query(query, [title, description, startdate, enddate, difficulty, assignmentID]);
            if (results.rowCount === 0) throw new Error("Update failed");

            response.code = 200;
            response.body.message = results.rows[0];
        } catch (error) {
            response.code = 500;
            response.body.message = error.message;
            console.error("[ERROR in manageAssignmentsModel.update]:", error);
        }

        return response;
    },

    updateScores: async (assignmentID, plagiarismScore) => {
        const query = `
            UPDATE submissions
            SET ai_plagiarism_score = $1, plagiarism_score = $2
            WHERE submissionFilename = $3
        `;

        try {
            for (const fileName in plagiarismScore) {
                let { ai_score, plagiarism_score } = plagiarismScore[fileName];

                ai_score = Math.round(parseFloat(ai_score)) || 0;
                plagiarism_score = Math.round(parseFloat(plagiarism_score)) || 0;

                await dbPool.query(query, [ai_score, plagiarism_score, fileName]);
            }
            const checkPlagiarismQuery = `
            UPDATE assignments
            set plagarism_check = TRUE
            where assignmentID = $1;
            `

            await dbPool.query(checkPlagiarismQuery, [assignmentID]);

            response.code = 200;
        } catch (error) {
            response.code = 500;
            response.body.message = error.message;
            console.error("[ERROR in manageAssignmentsModel.updateScores]:", error);
        }
        return response;
    },

    delete: async (assignmentID) => {

        const query = `DELETE FROM assignments WHERE assignmentID = $1 RETURNING *;`;

        try {
            const results = await dbPool.query(query, [assignmentID]);
            if (results.rowCount === 0) throw new Error("Delete failed");

            response.code = 200;
            response.body.message = results.rows[0]; // Return deleted assignment data
        } catch (error) {
            response.code = 500;
            response.body.message = error.message;
            console.error("[ERROR in manageAssignmentsModel.delete]:", error);
        }

        return response;
    },

    filter: async (title, difficulty, status, startDate, endDate) => {

        try {
            const conditions = [];
            const params = [];
            let paramIndex = 1;

            let query = "SELECT * FROM assignments";

            if (title) {
                conditions.push(`LOWER(title) LIKE LOWER($${paramIndex++})`);
                params.push(`%${title}%`);
            }
            if (difficulty) {
                conditions.push(`difficulty = $${paramIndex++}`);
                params.push(difficulty);
            }
            if (status) {
                conditions.push(`status = $${paramIndex++}`);
                params.push(status);
            }
            if (startDate) {
                conditions.push(`startDate >= $${paramIndex++}`);
                params.push(startDate);
            }
            if (endDate) {
                conditions.push(`endDate <= $${paramIndex++}`);
                params.push(endDate);
            }

            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }

            const results = await dbPool.query(query, params);
            response.code = 200;
            response.body.message = results.rows;
        } catch (error) {
            response.code = 500;
            response.body.message = error.message;
            console.error("[ERROR in manageAssignmentsModel.filter]:", error);
        }

        return response;
    },

    view: async (userID, type) => {

        try {
            let query = "";

            if (type === "participant") {
                query = `
                    SELECT * 
                    FROM assignmentsinfo ai
                    INNER JOIN users u ON ai.userID = u.userID
                    INNER JOIN assignments a ON ai.assignmentID = a.assignmentID
                    INNER JOIN submissions s ON s.assignmentInfoID = ai.assignmentInfoID
                    WHERE u.userID = $1;`;
            } else if (type === "owner") {
                query = `
                    SELECT *
                    FROM users u
                    INNER JOIN assignments a ON u.userID = a.userID
                    WHERE u.userID = $1;`;
            } else if (type === "getSubmissions") {
                query = `
                    SELECT 
                        a.assignmentID,
                        a.title,
                        a.description,
                        a.startDate,
                        a.endDate,
                        a.difficulty,
                        a.status,
                        a.join_code,
                        ai.userID AS participantID,
                        u.userName AS participantName,
                        s.submissionID,
                        s.submissionFilename,
                        s.submissionOriginalFilename,
                        s.submissionFilePath,
                        s.submissionFileType,
                        s.submissionFileSize,
                        s.submissionStatus,
                        s.submissionDate,
                        s.ai_plagiarism_score,
                        s.plagiarism_score
                    FROM assignments a
                    INNER JOIN assignmentsinfo ai ON a.assignmentID = ai.assignmentID
                    INNER JOIN users u ON ai.userID = u.userID
                    LEFT JOIN submissions s ON ai.assignmentInfoID = s.assignmentInfoID
                    WHERE a.userID = $1
                    ORDER BY a.assignmentID, s.submissionDate DESC;
                    `;
            } else {
                throw new Error("Invalid type provided");
            }

            const results = await dbPool.query(query, [userID]);
            response.code = 200;
            response.body.message = results.rows;
        } catch (error) {
            response.code = 500;
            response.body.message = error.message;
            console.error("[ERROR in manageAssignmentsModel.view]:", error);
        }

        return response;
    },

    joinAssignment: async (joinCode, userID) => {
        try {
            const result = await dbPool.query(
                `
                SELECT * 
                FROM assignments 
                WHERE join_code = $1;
                `, 
                [joinCode]);

            if (result.rows.length === 0) {
                response.code = 404;
                response.body.message = "Invalid join code"
                return response;
            }

            const assignmentid = result.rows[0].assignmentid;

            const existingEntry = await dbPool.query(
                `SELECT * 
                FROM assignmentsinfo 
                WHERE assignmentID = $1 AND userID = $2;
                `, 
                [assignmentid, userID]
            );

            if (existingEntry.rows.length > 0) {
                response.code = 400;
                response.body.message = "You have already joined this assignment";
                return response;
            }

            const joinResult = await dbPool.query(
                "INSERT INTO assignmentsinfo (assignmentID, userID) VALUES ($1, $2) RETURNING *",
                [assignmentid, userID]
            );

            const assignmentinfoid = joinResult.rows[0].assignmentinfoid;
            await dbPool.query(
                `
                INSERT INTO submissions (assignmentInfoID)
                VALUES ($1);
                `, [assignmentinfoid])
            
            
            return manageAssignmentsModel.view(userID, "participant");

        } catch (error) {
            response.code = 500;
            response.body.message = error.message;
            console.error("[ERROR in manageAssignmentsModel.joinAssignment]:", error);
            return response;
        }

    },

    submit: async(userID, assignmentID, file) => {
        const submissionDate = new Date();
        try{
            const getAssignmentInfo = await dbPool.query(`
                SELECT * 
                FROM assignmentsinfo
                WHERE assignmentID = $1 AND userID = $2;
                `
            , [assignmentID, userID]);

            const assignmentInfoID = getAssignmentInfo.rows[0].assignmentinfoid;
            
            const query = `
            UPDATE submissions
            SET 
                submissionFilename = $2,
                submissionOriginalFilename = $3,
                submissionFilePath = $4,
                submissionFileType = $5,
                submissionFileSize = $6,
                submissionIsZip = $7,
                submissionDate = $8,
                submissionStatus = $9
            WHERE assignmentInfoID = $1;
            `;
    
            await dbPool.query(query, [assignmentInfoID, file.filename, file.originalFilename, file.filePath, file.fileType, file.fileSize, file.isZip, submissionDate, 'SUBMITTED']);
             
            // Marking Plagiarism check as false as new file submitted.
            const checkPlagiarismQuery = `
            UPDATE assignments
            set plagarism_check = FALSE
            where assignmentID = $1;
            `

            await dbPool.query(checkPlagiarismQuery, [assignmentID]);

            response.code = 201;
            response.body.message = "Assignment Submitted Successfully."
            response.body.submission = {
                filePath: file.filePath,
                filename: file.filename,
                originalFilename: file.originalFilename,
                submissionDate: submissionDate
            };
        } catch (error) {
            response.code = 500;
            response.body.message = error.message;
            console.error("[ERROR in manageAssignmentsModel.submit]:", error);
        }

        return response;
    }
};

module.exports = manageAssignmentsModel;