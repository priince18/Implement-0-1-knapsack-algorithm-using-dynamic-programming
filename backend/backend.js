const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
    
});

app.post("/save-data", async (req, res) => {
    try {
        const { weights, values, capacity, totalProfit } = req.body;

        await pool.query(
            "INSERT INTO knapsack_data(weights, values, capacity, total_profit) VALUES($1,$2,$3,$4)",
            [
                weights.join(","),
                values.join(","),
                capacity,
                totalProfit
            ]
        );

        res.json({ message: "Data Saved Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database Error" });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
