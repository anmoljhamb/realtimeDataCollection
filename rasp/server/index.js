const http = require("http");
const app = require("./app");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const { saveToFile } = require("./utils");
require("dotenv").config({ path: path.join(__dirname, "config.env") });

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: "*" });

app.get("/update-sensor", (req, res) => {
    saveToFile(req.query);
    res.status(200).json({ message: "Ok" });
});

io.on("connection", (socket) => {
    console.log(`new user connection from socket.id: ${socket.id}`);
});

server.listen(PORT, () => {
    console.log(`Listening on the url *:${PORT}`);
});
