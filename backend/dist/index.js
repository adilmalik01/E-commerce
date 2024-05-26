"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const product_1 = __importDefault(require("./routes/product"));
const auth_1 = __importDefault(require("./routes/auth"));
const orders_1 = __importDefault(require("./routes/orders"));
const category_1 = __importDefault(require("./routes/category"));
const unauthRoutes_1 = __importDefault(require("./routes/unauthRoutes"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: "*",
        credentials: true
    }
});
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", auth_1.default);
app.use("/api/v1", unauthRoutes_1.default);
app.use("/api/v1", (req, res, next) => {
    // JWT
    let token = req.cookies.token;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "adilmalik");
        req.body.currentUser = {
            email: decoded.email,
            isAdmin: decoded.isAdmin,
            fullName: decoded.fullName,
            _id: decoded._id,
            avatar: decoded.avatar,
        };
        next();
    }
    catch (err) {
        res.status(401).send({ message: "Unauthorized" });
    }
});
// Pass socket.io instance to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use("/api/v1", product_1.default);
app.use("/api/v1", orders_1.default);
app.use("/api/v1", category_1.default);
app.get("/api/v1/ping", (req, res) => {
    res.send(req.body.currentUser);
});
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname + "../../../frontend/build/index.html"));
});
io.on("connection", (socket) => {
    console.log("New client connected with id: ", socket.id);
    socket.emit("topic 1", "some data");
    socket.on("disconnect", (message) => {
        console.log("Client disconnected with id: ", message);
    });
});
// setInterval(() => {
//   io.emit("Test topic", { event: "ADDED_ITEM", data: "some data" });
//   console.log("emitting data to all clients");
// }, 2000);
const PORT = 5001 || process.env.PORT;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
