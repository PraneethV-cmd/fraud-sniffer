const login = require("../Models/login");

const Login = async (req, res) => {
    try {
        const { usernameORemail, password } = req.body;

        const response = await login(usernameORemail, password);

        if (!response) {
            return res.status(500).json({ error: "Login failed" });
        }

        res.status(response.code).json(response.body.message);
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = Login;