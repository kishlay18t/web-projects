const express = require("express");
const app = express();
const port = 3000;

//Route 1: The root (home) -- Sending plain html text
app.get("/", (req, res) => {
    res.send("Express server");
});

//route 2: Sending JSON data (JSON = javascript object notation)
// Javascript array of object - Imagine grabbing this from the database.
const users = [
    { id: 1, name: "Alice", Role: "Admin" },
    { id: 2, name: "Bob", Role: "Developer" }
];
console.log(users[0]);
app.get('/api/users', (req, res) => 
{
    // Sending in the form of JSON.
    res.json(users);
});

//route 3: Dynamic routing (URL Parameters)
// The colon ':' means 'id' is a variable
// When typing the URL in browser, don't use colon ':'
app.get('/api/users/:id', (req, res) =>
{
    //request.params means variables present in the URL 
    // '.id' for just the ID variable
    const requestedID = req.params.id;

    // '.find()' js function helps search the array for any particular object.
    // Use parseFloat to change 'requestedID' from string to number.  
    const foundUser = users.find(user => user.id === parseFloat(requestedID));

    if (foundUser)
    {
        res.json({
            message: "User found successfully!",
            data: foundUser
        });
    }
    else
    {
        // Send error 404 if the requested ID not found.
        res.status(404).json({
            message: `uh oh, we could not find a user with ID: ${requestedID}`
        });
    }
});


app.listen(port, function () {
    console.log(`Server app is listening on port: ${port}`);
});