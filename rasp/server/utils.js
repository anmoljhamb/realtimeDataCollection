const moment = require("moment");

function saveToFile(values) {
    const time = moment().format("h:mm:ss a, MMMM Do YYYY"); // January 28th 2023, 1:20:29 pm

    values = { ...values, time };

    let pastData = fs.readFileSync(path.join(__dirname, "data.json"), {
        encoding: "utf-8",
    });

    pastData = JSON.parse(pastData);

    let newData = [values, ...pastData];
    fs.writeFileSync(
        path.join(__dirname, "data.json"),
        JSON.stringify(newData)
    );
}

module.exports = {
    saveToFile,
};
