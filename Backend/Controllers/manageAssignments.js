const manageAssignmentsModel = require('../Models/manageAssignments');

const manageAssignmentsController = {
    get: async(req, res) => {
        const assignmentID = req.params.assignmentID;
        const response = await manageAssignmentsModel.get(assignmentID);
        res.status(response.code)
            .json(response.body);
    },

    create: async(req, res) => {
        const { userID, title, endDate, description } = req.body;
        const startDate = new Date();

        const response = await manageAssignmentsModel.create(userID, title, description, startDate, endDate);
        res.status(response.code)
            .json(response.body);
    },

    update: async(req, res) => {
        const assignmentID = req.params.assignmentID;
        const { startDate, endDate, title, description } = req.body;

        const response = await manageAssignmentsModel.update(assignmentID, title, description, startDate, endDate);
        res.status(response.code)
            .json(response.body);
    },

    delete: async(req, res) =>{
        const assignmentID = req.params.assignmentID;

        const response = await manageAssignmentsModel.delete(assignmentID);
        res.status(response.code)
            .json(response.body);
    }
}

module.exports = manageAssignmentsController;