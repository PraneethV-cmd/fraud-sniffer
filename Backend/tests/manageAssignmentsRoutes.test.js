const request = require("supertest");
const express = require("express");
const manageAssignmentsController = require("../Controllers/manageAssignments");
const upload = require("../Middleware/uploadMiddleware");
const assignmentRoutes = require("../Routers/manageAssignments");



jest.mock("../Controllers/manageAssignments");
jest.mock("../Middleware/uploadMiddleware", () => ({
    single: jest.fn(() => (req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use("/assignments", assignmentRoutes);

describe("Manage Assignments API Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should fetch all assignments successfully", async () => {
        manageAssignmentsController.view.mockImplementation((req, res) => {
            res.status(200).json({ message: "Fetched assignments" });
        });

        const res = await request(app).get("/assignments/view");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Fetched assignments");
        expect(manageAssignmentsController.view).toHaveBeenCalled();
    });

    test("should fetch a specific assignment", async () => {
        manageAssignmentsController.get.mockImplementation((req, res) => {
            res.status(200).json({ message: "Fetched assignment", id: req.params.assignmentID });
        });

        const res = await request(app).get("/assignments/123");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Fetched assignment");
        expect(res.body.id).toBe("123");
        expect(manageAssignmentsController.get).toHaveBeenCalled();
    });

    test("should create an assignment successfully", async () => {
        manageAssignmentsController.create.mockImplementation((req, res) => {
            res.status(201).json({ message: "Assignment created" });
        });

        const res = await request(app)
            .post("/assignments/create")
            .field("otherfields", JSON.stringify({ title: "Math Homework" }))
            .attach("assignment", Buffer.from("dummy content"), "test.pdf");

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Assignment created");
        expect(manageAssignmentsController.create).toHaveBeenCalled();
    });

    test("should return 400 for invalid JSON in otherfields", async () => {
        const res = await request(app)
            .post("/assignments/create")
            .field("otherfields", "{invalidJson}")
            .attach("assignment", Buffer.from("dummy content"), "test.pdf");

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Invalid JSON format in otherfields");
    });

    test("should update an assignment successfully", async () => {
        manageAssignmentsController.update.mockImplementation((req, res) => {
            res.status(200).json({ message: "Assignment updated" });
        });

        const res = await request(app).put("/assignments/123").send({ title: "Updated Title" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Assignment updated");
        expect(manageAssignmentsController.update).toHaveBeenCalled();
    });

    test("should delete an assignment successfully", async () => {
        manageAssignmentsController.delete.mockImplementation((req, res) => {
            res.status(200).json({ message: "Assignment deleted" });
        });

        const res = await request(app).delete("/assignments/123");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Assignment deleted");
        expect(manageAssignmentsController.delete).toHaveBeenCalled();
    });

    test("should submit an assignment", async () => {
        manageAssignmentsController.submit.mockImplementation((req, res) => {
            res.status(200).json({ message: "Assignment submitted" });
        });

        const res = await request(app)
            .post("/assignments/123/submit")
            .attach("assignment", Buffer.from("dummy content"), "test.pdf");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Assignment submitted");
        expect(manageAssignmentsController.submit).toHaveBeenCalled();
    });

    test("should allow joining an assignment", async () => {
        manageAssignmentsController.joinAssignment.mockImplementation((req, res) => {
            res.status(200).json({ message: "Joined assignment" });
        });

        const res = await request(app).post("/assignments/join").send({ assignmentID: "123" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Joined assignment");
        expect(manageAssignmentsController.joinAssignment).toHaveBeenCalled();
    });
});
