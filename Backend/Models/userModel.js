const dbPool = require("../Database/createPool");
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

const response = {
    code: 503, 
    body: { 
        message: "",
        token: ""
    } 
};

const userModel = {
    getProfile: async(userID) => {
        const query = "SELECT * FROM users WHERE userID = $1";
        try{
            const result = await dbPool.query(query, [userID]);
            if(result.rows.length){
                response.code = 200;
                response.body.message = result.rows[0];
            }else{
                response.body.message = "User not found";
                response.code = 404;
            }
        }catch(error){
            response.code = 500;
            response.body.message = error.message;
            console.error("[ERROR in userModel.getProfile]:", error);
        }
        return response;
    },

    updateProfile: async(userID, userName, password, email) => {
        try{
            const userNameQuery = `
            SELECT *
            FROM users
            where userName = $1;
            `;

            const userNameResponse = await dbPool.query(userNameQuery, [userName]);
            if(userNameResponse.rows.length){
                response.code = 400;
                response.body.message = "Username already exists";
                return response;
            }

            const emailQuery = `
            SELECT * 
            FROM users
            where email = $1;
            `;

            const emailResponse = await dbPool.query(emailQuery, [email]);;
            if(emailResponse.rows.length){
                response.code = 400;
                response.body.message = "Email already exists";
                return response;
            }

            const updateQuery = `
            UPDATE users 
            SET userName = $1, password = $2, email = $3 
            WHERE userID = $4;
            `;
            const hashedPassword = await hashPassword(password)
            await dbPool.query(updateQuery, [userName, hashedPassword, email, userID]);
            response.code = 200;
            response.body.message = "Profile updated";
            return response;
        }catch(error){
            response.code = 500;
            response.body.message = error.message;
            return response;
        }
    }
}

module.exports = userModel;