const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config.env") });

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: "*" });

io.on("connection", (socket) => {
    console.log(`new user connection from socket.id: ${socket.id}`);
});

server.listen(PORT, () => {
    console.log(`Listening on the url *:${PORT}`);
});
