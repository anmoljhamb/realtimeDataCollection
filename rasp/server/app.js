const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { getData } = require("./utils");

let requestData = false;
let delayTime = 2000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

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

app.get("/getDelayTime", (req, res) => {
    return res.send(delayTime.toString());
});

app.get("/setDelayTime/:time", (req, res) => {
    delayTime = Number.parseInt(req.params.time);
    return res.status(200).json({ message: "Ok" });
});

app.get("/getData", (req, res) => {
    return res.status(200).json(getData());
});

app.get("/getDataJson", (req, res) => {
    return res.download(path.join(__dirname, "data.json"));
});

module.exports = app;
