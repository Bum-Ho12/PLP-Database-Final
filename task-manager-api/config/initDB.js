const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function initializeDatabase() {
    console.log('Starting database initialization...');

    // Database connection configuration
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        multipleStatements: true
    };

    try {
        // Create connection
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL server');

        // Read SQL file
        const schemaFilePath = path.join(__dirname, '..','sql', 'task_manager.sql');
        console.log(`Reading schema file from: ${schemaFilePath}`);

        const sqlScript = fs.readFileSync(schemaFilePath, 'utf8');

        // Execute SQL script
        console.log('Executing SQL script...');
        await connection.query(sqlScript);
        console.log('Database initialized successfully!');

        // Close connection
        await connection.end();
        console.log('Database connection closed');

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Run initialization
initializeDatabase();