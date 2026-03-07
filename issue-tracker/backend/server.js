// Import the libraries we installed
const express = require('express');
const cors = require('cors');

// Initialize the Express application
const app = express();
const PORT = 3000;

// Middleware (Intercepts requests before they hit your routes)
app.use(cors()); // Allows your frontend to talk to your backend
app.use(express.json()); // Tells the server to understand JSON data

// A basic Route (API Endpoint)
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", message: "Server is running perfectly!" });
});

// Start listening for requests
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
