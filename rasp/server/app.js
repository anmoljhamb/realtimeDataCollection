const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

let requestData = false;
let delayTime = 2000;

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

app.get("/getDelayTime", (req, res) => {
    return res.send(delayTime.toString());
});

app.get("/setDelayTime/:time", (req, res) => {
    delayTime = Number.parseInt(req.params.time);
    return res.status(200).json({ message: "Ok" });
});

app.get("/getData", (req, res) => {
    return res.status(200).json(
        JSON.parse(
            fs.readFileSync(path.join(__dirname, "data.json"), {
                encoding: "utf-8",
            })
        )
    );
});

module.exports = app;
