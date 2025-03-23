const path = require("path");
const fs = require("fs");
const fileModel = require("../Models/fileModel");


jest.mock("fs");

describe("File Model Tests", () => {
    const mockFileName = "testFile.txt";
    const mockFilePath = path.join(__dirname, "../uploads", mockFileName);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return file details when file exists", async () => {
        fs.existsSync.mockReturnValue(true); // Mock file exists

        const response = await fileModel(mockFileName);

        expect(response.fileName).toBe(mockFileName);
        expect(response.filePath).toBe(mockFilePath);
        expect(response.statusCode).toBe(200);
    });

    test("should return 404 when file does not exist", async () => {
        fs.existsSync.mockReturnValue(false); // Mock file does not exist

        const response = await fileModel(mockFileName);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe(`File not found at path:${mockFilePath}`);
    });
});
