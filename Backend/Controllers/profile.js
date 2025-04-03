const profileModel = require("../Models/profile");

const profileController = {
    getUserProfile: async (req, res) => {
        try {
            const userID = req.params.userID;
            
            if (!userID) {
                return res.status(400).json({ error: "User ID is required" });
            }

            const response = await profileModel.getUserProfile(userID);
            res.status(response.code).json(response.body.message);
        } catch (err) {
            console.error("Error fetching user profile:", err);
            res.status(500).json({ error: "Server error" });
        }
    }
};

module.exports = profileController;
