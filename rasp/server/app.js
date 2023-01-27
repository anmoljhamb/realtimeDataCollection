const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

let requestData = false;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Ok" });
});

app.get("/getRequestData", (req, res) => {
    res.send(requestData);
});

app.get("/stopRequestData", (req, res) => {
    requestData = false;
    res.status(200).json({ message: "Done." });
});

app.get("/startRequestData", (req, res) => {
    requestData = true;
    res.status(200).json({ message: "Done" });
});

module.exports = app;
