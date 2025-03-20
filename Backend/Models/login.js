const dbPool = require("../Database/createPool");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function verifyPassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

const response = {
    code: 503, 
    body: { 
        message: "",
        token: ""
    } 
};

const Login = async (usernameORemail, password) => {
    const fetchUserQuery = `
    SELECT * FROM users 
    WHERE userName = $1 OR email = $1;
    `;

    try {
        const userResults = await dbPool.query(fetchUserQuery, [usernameORemail]);
        if (userResults.rowCount === 0) throw new Error("User Not found");
        const isMatch = await verifyPassword(password, userResults.rows[0].password)
        if (!isMatch) throw new Error("Incorrect password");

        response.code = 200;
        response.body.message = "Successfully verified identity";
        const token = jwt.sign({ userID: userResults.rows[0].userid }, "my-32-character-ultra-secure-and-ultra-long-secret", {
            expiresIn: '1h',
        });
        response.body.token = token;
    } catch (error) {
        response.code = error.message === "User Not found" ? 404 : 500;
        response.code = error.message === "Incorrect password" ? 401 : 500;
        response.body.message = error.message;
        console.error("[ERROR in LoginModel]:", error);
    }

    return response;
}

module.exports = Login;