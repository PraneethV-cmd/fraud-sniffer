require('dotenv').config();
const fs = require('fs');

const poolConnection = require("./createPool");

const initSchema = async () => {
    try {
        await poolConnection.connect();
        // Read the schema.sql file
        const schema = await fs.promises.readFile("./database/schema.sql", "utf8");
        await poolConnection.query(schema);

        console.log("[LOG]: Schema Initialized Successfully");
    } catch (err) {
        console.error("[ERROR in InitSchema]:", err);
    }
};


module.exports = {
    initSchema
}
