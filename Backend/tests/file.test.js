const request = require("supertest");
const express = require("express");
const fileController = require("../Controllers/fileController");
const fileModel = require("../Models/fileModel"); 

jest.mock("../Models/fileModel"); // Mocking fileModel

const app = express();
app.get("/download/:filename", fileController);

describe("File Controller Tests", () => {
    test("Should download the file successfully", async () => {
        const mockFilename = "testfile.txt";
        const mockPath = "/uploads";
        const mockResponse = {
            filePath: "/uploads/testfile.txt",
            fileName: "testfile.txt",
        };

        fileModel.mockResolvedValue(mockResponse); // Mocking function response

        const response = await request(app).get(`/download/${mockFilename}`).query({ path: mockPath });

        expect(response.status).toBe(200);
        expect(response.header["content-disposition"]).toContain("attachment");
    });

    test("Should return 500 error if file download fails", async () => {
        const mockFilename = "invalidfile.txt";
        const mockPath = "/invalidpath";
        const mockError = { body: { message: "File not found" } };

        fileModel.mockResolvedValue(mockError); // Mocking error case

        const response = await request(app).get(`/download/${mockFilename}`).query({ path: mockPath });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("error", "Server error");
    });
});
