const register = require("../Models/register");

const Register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const response = await register(username, email, password);

        if (!response) {
            return res.status(500).json({ error: "Registration failed" });
        }

        res.status(response.code).json(response.body.message);
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = Register;