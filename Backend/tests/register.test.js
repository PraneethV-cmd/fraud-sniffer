const Register = require("../Models/register"); // Import the function
const dbPool = require("../Database/createPool"); // Mock database connection
const bcrypt = require("bcrypt");

// Mock database query method
jest.mock("../Database/createPool", () => ({
    query: jest.fn()
}));

// Mock bcrypt functions
jest.mock("bcrypt", () => ({
    genSalt: jest.fn(() => "fakeSalt"),
    hash: jest.fn(() => "hashedPassword123")
}));

describe("User Registration API Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test("should return 200 when a new user registers successfully", async () => {
        dbPool.query
            .mockResolvedValueOnce({ rowCount: 0 }) // Simulate no existing user
            .mockResolvedValueOnce({ rowCount: 1 }); // Simulate successful insert

        const res = await Register("newUser", "new@example.com", "securePass");

        expect(res.code).toBe(200);
        expect(res.body).toHaveProperty("message", "Successfully registered user");
        expect(dbPool.query).toHaveBeenCalledTimes(2);
    });

    test("should return 409 when username or email already exists", async () => {
        dbPool.query.mockResolvedValueOnce({ rowCount: 1 }); // Simulate user exists

        const res = await Register("existingUser", "existing@example.com", "securePass");

        expect(res.code).toBe(409);
        expect(res.body).toHaveProperty("message", "Username Already Exists");
        expect(dbPool.query).toHaveBeenCalledTimes(1);
    });

    test("should return 500 when database insertion fails", async () => {
        dbPool.query
            .mockResolvedValueOnce({ rowCount: 0 }) // Simulate no existing user
            .mockResolvedValueOnce({ rowCount: 0 }); // Simulate insert failure

        const res = await Register("failUser", "fail@example.com", "securePass");

        expect(res.code).toBe(500);
        expect(res.body).toHaveProperty("message", "Failed to register user");
        expect(dbPool.query).toHaveBeenCalledTimes(2);
    });

    test("should return 500 on unexpected errors", async () => {
        dbPool.query.mockRejectedValue(new Error("Database connection error")); // Simulate DB error

        const res = await Register("errorUser", "error@example.com", "securePass");

        expect(res.code).toBe(500);
        expect(res.body).toHaveProperty("message", "Database connection error");
        expect(dbPool.query).toHaveBeenCalledTimes(1);
    });
});
