const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 1. Create a connection to the database file
// __dirname means "the directory this file is in". We save it as 'database.sqlite'
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("✅ Connected to the SQLite database.");
    }
});

// 2. Set up our Application Tables
// We run this once when the server starts to make sure our tables exist
db.serialize(() => {

    // Create 'users' table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);

    // Create 'issues' (bugs) table
    db.run(`CREATE TABLE IF NOT EXISTS issues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'Open',
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
});

// Export the database so other files (like server.js) can use it
module.exports = db;
