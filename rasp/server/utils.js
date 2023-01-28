const moment = require("moment");
const fs = require("fs");
const path = require("path");

function saveToFile(values) {
    const time = moment().format("h:mm:ss a, DD/MM/YY");

    values = { ...values, time };

    let pastData = fs.readFileSync(path.join(__dirname, "data.json"), {
        encoding: "utf-8",
    });

    pastData = JSON.parse(pastData);

    let newData = [...pastData, values];
    fs.writeFileSync(
        path.join(__dirname, "data.json"),
        JSON.stringify(newData)
    );
}

function getData() {
    return JSON.parse(
        fs.readFileSync(path.join(__dirname, "data.json"), {
            encoding: "utf-8",
        })
    );
}

module.exports = {
    saveToFile,
    getData,
};
