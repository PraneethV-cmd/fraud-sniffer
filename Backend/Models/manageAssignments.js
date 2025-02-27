const dbPool = require("../Database/createPool");
const { v4: uuidv4 } = require("uuid");

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
        const joinCode = uuidv4().substring(0, 6);

        const query = `
        INSERT INTO assignments (userID, title, description, startDate, endDate, difficulty, filename, originalFilename, filePath, fileType, fileSize, isZip, join_code, join_code_expires_at)
        VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'no_file'), COALESCE($8, 'no_file'), COALESCE($9, ''), COALESCE($10, 'unknown'), COALESCE($11, 0), COALESCE($12, FALSE), $13, NOW() + INTERVAL '7 day')
        RETURNING *;`;

        try {
            const paramsWithJoinCode = [...params, joinCode];
            const results = await dbPool.query(query, paramsWithJoinCode);
            response.code = 201;
            response.body.message = results.rows[0];
            console.log("[LOG] Assignment created with join code:", joinCode);
        } catch (error) {
            response.code = 500;
            response.body.message = error.message;
            console.error("[ERROR in manageAssignmentsModel.create]:", error);
        }

        return response;
    },

    update: async (assignmentID, title, description, startDate, endDate, difficulty) => {

        const query = `
        UPDATE assignments
        SET title = $1, description = $2, startDate = $3, endDate = $4, difficulty = $5
        WHERE assignmentID = $6
        RETURNING *;`;

        try {
            const results = await dbPool.query(query, [title, description, startDate, endDate, difficulty, assignmentID]);
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
                    FROM assignments a
                    INNER JOIN users u ON a.userID = u.userID
                    WHERE u.userID = $1;`;
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
                "SELECT * FROM assignments WHERE join_code = $1 AND (join_code_expires_at > NOW() OR join_code_expires_at IS NULL)", 
                [joinCode]);

            if (result.rows.length === 0) {
                response.code = 404;
                response.body.message = "Invalid or expired join code"
                return response;
            }

            const assignmentid = result.rows[0].assignmentid;

            const existingEntry = await dbPool.query(
                "SELECT * FROM assignmentsinfo WHERE assignmentID = $1 AND userID = $2", 
                [assignmentid, userID]
            );

            if (existingEntry.rows.length > 0) {
                response.code = 400;
                response.body.message = "You have already joined this assignment";
                return response;
            }

            const joinResult = await dbPool.query(
                "INSERT INTO assignmentsinfo (assignmentID, userID, status) VALUES ($1, $2, $3) RETURNING *",
                [assignmentid, userID, "IN_PROGRESS"]
            );

            response.code = 200;
            response.body.message = `Successfully joined assignment
            Assignment ID: ${assignmentid}
            User ID: ${userID}
            Status: ${joinResult.rows[0].status}`;

        } catch (error) {
            response.code = 500;
            response.body.message = error.message;
            console.error("[ERROR in manageAssignmentsModel.joinAssignment]:", error);
        }

        return response;
    },
};

module.exports = manageAssignmentsModel;

