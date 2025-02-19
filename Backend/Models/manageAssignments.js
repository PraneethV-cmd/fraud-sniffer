const { stat } = require("fs");
const dbPool = require("../Database/createPool");

const response = {
    code: 503,
    body: {
        message: ""
    }
}

const manageAssignmentsModel = {
    get: async (assignmentID) => {
        const dbClient = await dbPool.connect();

        const query = `
        SELECT *
        FROM assignments
        WHERE assignmentID = $1;
        `;

        try {
            const results = await dbClient.query(query, [assignmentID]);
            if(results.rowCount == 0) throw new Error("Not found");
            response.code = 200;
            response.body.message = results;
        } catch (error) {
            if(error == "Not found") response.code = 404;
            response.body.message = error.message;
            console.log("[ERROR in manageAssignmentsModel.update]: ", error);
        } finally {
            dbClient.release();
            return response;
        }
    },

    create: async(userID, title, description, startDate, endDate) => {
        const dbClient = await dbPool.connect();

        const query = `
        INSERT INTO assignments
        (userID, title, description, startDate, endDate)
        VALUES ($1, $2, $3, $4, $5);
        `;

        try {
            const results = await dbClient.query(query, [userID, title, description, startDate, endDate]);
            if(results.rowCount == 0) throw new Error("Creation failed");
            response.code = 201;
            response.body.message = results;

        } catch (error) {
            response.body.message = error.message;
            console.log("[ERROR in manageAssignmentsModel.create]: ", error);
        } finally {
            dbClient.release();
            return response;
        }

    },

    update: async(assignmentID, title, description, endDate) => {
        const dbClient = await dbPool.connect();
        
        const query = `
        UPDATE assignments
        SET title = $1, description = $2, endDate = $3
        WHERE assignmentID = $4;
        `;

        try {
            const results = await dbClient.query(query, [title, description, endDate, assignmentID]);
            if(results.rowCount == 0) throw new Error("Updation failed");
            response.code = 200;
            response.body.message = results;
        } catch (error) {
            response.body.message = error.message;
            console.log("[ERROR in manageAssignmentsModel.update]: ", error);
        } finally {
            dbClient.release();
            return response;
        }
    },

    delete: async(assignmentID) => {
        const dbClient = await dbPool.connect();

        const query = `
        DELETE FROM assignments
        WHERE assignmentID = $1;
        `;

        try {
            const results = await dbClient.query(query, [assignmentID]);
            response.code = 410;
            response.body.message = results;
        } catch (error) {
            response.body.message = error.message;
            console.log("[ERROR in manageAssignmentsModel.update]: ", error);
        } finally {
            dbClient.release();
            return response;
        }
    },

    filter: async(title, difficulty, status, startDate, endDate) => {
        const dbClient = await dbPool.connect();

        try{
            const conditions = [];
            const params = [];
            let paramIndex = 1;

            let query = "SELECT * FROM assignments";

            if (title !== undefined) {
                conditions.push(`title = $${paramIndex++}`);
                params.push(title);
            }
            if (difficulty !== undefined) {
                conditions.push(`difficulty = $${paramIndex++}`);
                params.push(difficulty);
            }
            if (status !== undefined) {
                conditions.push(`status = $${paramIndex++}`);
                params.push(status);
            }

            if(startDate !== undefined){
                conditions.push(`startdate >= $${paramIndex++}`);
                params.push(startDate);
            }

            if(endDate !== undefined){
                conditions.push(`enddate <= $${paramIndex++}`);
                params.push(endDate);
            }

            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }

            const results = await dbClient.query(query, params);

            response.code = 200;
            response.body.message = results;
        } catch (error) {
            response.body.message = error.message;
            console.log("[ERROR in manageAssignmentsModel.update]: ", error);
        } finally {
            dbClient.release();
            return response;
        }
    },

    view: async (userID, type) => {
        const dbClient = await dbPool.connect();
        
        try{
            var query = "";
            if(type === "participant"){
                query = `
                        SELECT * 
                        FROM assignmentsinfo ai
                        INNER JOIN users u
                        ON ai.userid = u.userid
                        INNER JOIN assignments a
                        ON ai.assignmentid = a.assignmentid
                        WHERE u.userid = $1;
                        `;
            }else if(type === "owner"){
                query = `
                        SELECT *
                        FROM assignments a
                        INNER JOIN users u
                        on a.userid = u.userid
                        WHERE u.userid = $1;
                        `;
            }

            const results = await dbClient.query(query, [userID]);
            response.code = 200;
            response.body.message = results;
        } catch (error) {
            response.body.message = error.message;
            console.log("[ERROR in manageAssignmentsModel.update]: ", error);
        } finally {
            dbClient.release();
            return response;
        }
    }
}

module.exports = manageAssignmentsModel;