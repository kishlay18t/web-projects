const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Express server");
});

app.listen(port, function()
{
    console.log(`Server app is listening on port: ${port}`);
});