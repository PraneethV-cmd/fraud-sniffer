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
        await dbPool.connect();

        const query = `
        SELECT *
        FROM assignments
        WHERE assignmentID = $1;
        `;

        try {
            const results = await dbPool.query(query, [assignmentID]);
            if(results.rowCount == 0) throw new Error("Not found");
            response.code = 200;
            response.body.message = results;
        } catch (error) {
            if(error == "Not found") response.code = 404;
            response.body.message = error.message;
            console.log("[ERROR in manageAssignmentsModel.update]: ", error);
        } finally {
            return response;
        }
    },

    create: async(userID, title, description, startDate, endDate) => {
        await dbPool.connect();

        const query = `
        INSERT INTO assignments
        (userID, title, description, startDate, endDate)
        VALUES ($1, $2, $3, $4, $5);
        `;

        try {
            const results = await dbPool.query(query, [userID, title, description, startDate, endDate]);
            if(results.rowCount == 0) throw new Error("Creation failed");
            response.code = 201;
            response.body.message = results;

        } catch (error) {
            response.body.message = error.message;
            console.log("[ERROR in manageAssignmentsModel.create]: ", error);
        } finally {
            return response;
        }

    },

    update: async(assignmentID, title, description, startDate, endDate) => {
        await dbPool.connect();
        
        const query = `
        UPDATE assignments
        SET title = $1, description = $2, startDate = $3, endDate = $4
        WHERE assignmentID = $5;
        `;

        try {
            const results = await dbPool.query(query, [title, description, startDate, endDate, assignmentID]);
            if(results.rowCount == 0) throw new Error("Updation failed");
            response.code = 200;
            response.body.message = results;
        } catch (error) {
            response.body.message = error.message;
            console.log("[ERROR in manageAssignmentsModel.update]: ", error);
        } finally {
            return response;
        }
    },

    delete: async(assignmentID) => {
        await dbPool.connect();

        const query = `
        DELETE FROM assignments
        WHERE assignmentID = $1;
        `;

        try {
            const results = await dbPool.query(query, [assignmentID]);
            response.code = 410;
            response.body.message = results;
        } catch (error) {
            response.body.message = error.message;
            console.log("[ERROR in manageAssignmentsModel.update]: ", error);
        } finally {
            return response;
        }
    },

    filter: async(title, difficulty, status, startDate, endDate) => {
        await dbPool.connect();

        try{
            const conditions = [];
            const params = [];
            let paramIndex = 1;

            let query = "SELECT * FROM assignments";

            // Dynamically add filters
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

            const results = await dbPool.query(query, params);

            response.code = 200;
            response.body.message = results;
        } catch (error) {
            response.body.message = error.message;
            console.log("[ERROR in manageAssignmentsModel.update]: ", error);
        } finally {
            return response;
        }
    }
}

module.exports = manageAssignmentsModel;