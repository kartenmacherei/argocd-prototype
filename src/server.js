// server.js
const express = require("express");
const {receiveMessages} = require("./sqs");
const app = express();
const port = process.env.PORT || 3000;
receiveMessages();


app.get("/", (req, res) => {
    console.log('a new request has been Logged')
    res.status(200).send(`Hello Argo TEST`);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
