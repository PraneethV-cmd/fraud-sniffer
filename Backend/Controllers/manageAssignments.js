const manageAssignmentsModel = require('../Models/manageAssignments');

const manageAssignmentsController = {
    get: async(req, res) => {
        const assignmentID = req.params.assignmentID;
        const response = await manageAssignmentsModel.get(assignmentID);
        res.status(response.code)
            .json(response.body.message);
    },

    create: async(req, res) => {
        const { userID, title, endDate, description } = req.body;
        const startDate = new Date();

        const response = await manageAssignmentsModel.create(userID, title, description, startDate, endDate);
        res.status(response.code)
            .json(response.body.message);
    },

    update: async(req, res) => {
        const assignmentID = req.params.assignmentID;
        const { startDate, endDate, title, description } = req.body;

        const response = await manageAssignmentsModel.update(assignmentID, title, description, startDate, endDate);
        res.status(response.code)
            .json(response.body.message);
    },

    delete: async(req, res) =>{
        const assignmentID = req.params.assignmentID;

        const response = await manageAssignmentsModel.delete(assignmentID);
        res.status(response.code)
            .json(response.body.message);
    },

    filter: async(req, res) => {
        const title = req.query.title;
        const difficulty = req.query.difficulty;
        const status = req.query.status;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const response = await manageAssignmentsModel.filter(title, difficulty, status, startDate, endDate);
        res.status(response.code)
            .json(response.body.message);
    },
    
    view: async (req, res) => {
        const userID = req.query.userID; // Get from query params
        const type = req.query.type;

        if (!userID) {
            return res.status(400).json("UserID is required");
        }

        const response = await manageAssignmentsModel.view(userID, type);
        res.status(response.code)
            .json(response.body.message);
    }
}

module.exports = manageAssignmentsController;