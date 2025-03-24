const request = require("supertest");
const express = require("express");
const login = require("../Models/login"); // Import the model directly

jest.mock("../Models/login"); // Mock the login model

const Login = require("../Controllers/login");

const app = express();
app.use(express.json());
app.post("/api/login", Login);

describe("Login API Tests", () => {
    test("should return 200 and success response for valid credentials", async () => {
        login.mockResolvedValue({  // Mock the return value of login function
            code: 200,
            body: { message: "Login successful", token: "fakeToken123" }
        });

        const res = await request(app)
            .post("/api/login")
            .send({ usernameORemail: "test@example.com", password: "password123" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Login successful");
        expect(res.body).toHaveProperty("token");
    });

    test("should return 500 and error message for failed login", async () => {
        login.mockResolvedValue(null);  // Simulate failed login

        const res = await request(app)
            .post("/api/login")
            .send({ usernameORemail: "wrong@example.com", password: "wrongpass" });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Login failed");
    });

    test("should return 500 and server error message on exception", async () => {
        login.mockRejectedValue(new Error("Database error")); // Simulate server error

        const res = await request(app)
            .post("/api/login")
            .send({ usernameORemail: "error@example.com", password: "errorpass" });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Server error");
    });
});
