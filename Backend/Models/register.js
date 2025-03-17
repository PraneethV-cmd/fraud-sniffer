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
        message: "" 
    } 
};

const Register = async (userName, email, password) => {
    const fetchUserQuery = `
    SELECT * FROM users 
    WHERE userName = $1 OR email = $2;
    `;

    try {
        const userResults = await dbPool.query(fetchUserQuery, [userName, email]);
        if (userResults.rowCount >= 1) throw new Error("User Already Exists");
        const hashedPassword = await hashPassword(password)
        const insertUserQuery = `
        INSERT INTO users 
        (userName, email, password)
        VALUES 
        ($1, $2, $3)
        RETURNING *;
        `;

        const insertResponse = await dbPool.query(insertUserQuery, [userName, email, hashedPassword]);
        if(insertResponse.rowCount === 0) throw new Error("Failed to register user");

        response.code = 200;
        response.body.message = "Successfully registered user";
    } catch (error) {
        response.code = error.message === "User Already Exists" ? 409 : 500;
        response.body.message = error.message;
        console.error("[ERROR in LoginModel]:", error);
    }

    return response;
}

module.exports = Register;