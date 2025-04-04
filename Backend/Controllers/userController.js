const userModel = require("../Models/userModel");

const userController = {
    getProfile: async(req, res) => {
        try {
            const userID = req.params.userID;

            const response = await userModel.getProfile(userID);
            res.status(response.code).json(response.body.message);
        } catch (err) {
            console.error("[Error in userController.getProfile]", err);
            res.status(500).json({ error: "Server error" });
        }
    },


    updateProfile: async(req, res) => {
        try {
            const userID = req.params.userID;
            const { username, password ,email } = req.body;
            const response = await userModel.updateProfile(userID, username, password, email);
            res.status(response.code).json(response.body.message);
        } catch (err) {
            console.error("[Error in userController.updateProfile]", err);
            res.status(500).json({ error: "Server error" });
        }
    }
}

module.exports = userController;