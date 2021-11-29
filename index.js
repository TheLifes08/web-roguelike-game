const express = require("express");
const settings = require("./settings");

const server = express();

server.set("view engine", "pug");
server.set("views", "./views");

server.use("/public", express.static("public"));

server.get("/game", (request, response) => {
    response.render("game", { "game": settings.game });
});

server.get("/records", (request, response) => {
    response.render("records", { "game": settings.game });
});

server.get("/", (request, response) => {
    response.render("index", { "game": settings.game });
});

server.get("/*", (request, response) => {
    response.status(404);
    response.end("Not found.");
});

server.listen(settings.server.listen_port, settings.server.listen_ip, () => {
    console.log(`Server started at http://${settings.server.listen_ip}:${settings.server.listen_port}`);
});
