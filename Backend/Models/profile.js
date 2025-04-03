const dbPool = require("../Database/createPool");

const response = {
    code: 503,
    body: {
        message: ""
    }
};

const profileModel = {
    getUserProfile: async (userID) => {
        try {
            // Get basic user information
            const userQuery = `
                SELECT *
                FROM users
                WHERE userID = $1;
            `;

            const userResult = await dbPool.query(userQuery, [userID]);
            
            if (userResult.rows.length === 0) {
                response.code = 404;
                response.body.message = "User not found";
                return response;
            }

            response.code = 200;
            response.body.message = userResult.rows[0];
            return response;
            
        } catch (error) {
            response.code = 500;
            response.body.message = error.message;
            console.error("[ERROR in profileModel.getUserProfile]:", error);
            return response;
        }
    }
};

module.exports = profileModel;
