require('dotenv').config();

const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve frontend files
app.use(express.static(__dirname));

// Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// MySQL connection test
app.get('/api/db-test', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT DATABASE() AS database_name'
        );

        res.json({
            message: 'MySQL connected successfully!',
            database: rows[0].database_name
        });

    } catch (error) {
        console.error('Database error:', error.message);

        res.status(500).json({
            message: 'Database connection failed.',
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`MUST Application running at http://localhost:${PORT}`);
});