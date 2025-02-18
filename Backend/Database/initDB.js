require('dotenv').config();
const fs = require('fs');
const { Client } = require('pg');

const createConnection = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    try {
        await client.connect();
        console.log("[LOG]: DB Connection Successfully Established");
    } catch (err) {
        console.error("[ERROR]: Failed to establish connection to DB", err);
    }

    return client;
};

const initDB = async () => {
    const dbClient = await createConnection();
    try {
        const data = await fs.promises.readFile("./Database/Schema/schema.sql", "utf8");

        try {
            const result = await dbClient.query(data);
            console.log("[LOG]: Schema Initialized Successfully.");
        } catch (err) {
            console.error("[ERROR]: Schema Initialization Failed", err);
        }
    } catch (err) {
        console.error("[ERROR]: Failed to Read Schema File", err);
    }
};

module.exports = {
    initDB,
    createConnection
}