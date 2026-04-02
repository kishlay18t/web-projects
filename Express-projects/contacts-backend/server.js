console.log("I am in express server");

// import express from 'express';
// Alternative command to export express library. 
const express = require("express");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use("/api/contacts", require("./routes/contact_route"));

app.listen(port, () =>
{
    console.log(`Server is listening on the port: ${port}`);
});
