// server.js
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    console.log('a new request has been Logged')
    res.status(200).send(`Hello TEST MESSAGE`);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
