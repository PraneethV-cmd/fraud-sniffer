const dbPool = require("../Database/createPool");

const response = {
    code: 503,
    body: {
        error: "Service Unavailable",
        msg: ""
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
            response.code = 202;
            response.body.msg = results;
        } catch (error) {
            response.body.error = error;
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
            response.code = 202;
            response.body.msg = results;

        } catch (error) {
            response.body.error = error;
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
            response.code = 202;
            response.body.msg = results;
        } catch (error) {
            response.body.error = error;
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
            response.code = 202;
            response.body.msg = results;
        } catch (error) {
            response.body.error = error;
            console.log("[ERROR in manageAssignmentsModel.update]: ", error);
        } finally {
            return response;
        }
    }
}

module.exports = manageAssignmentsModel;