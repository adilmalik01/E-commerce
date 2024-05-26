"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orders_1 = require("../controllers/orders");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storageConfig = multer_1.default.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.originalname}`);
    },
});
var upload = (0, multer_1.default)({ storage: storageConfig });
router.post("/addorder", orders_1.AddOrders);
router.get("/all-orders", orders_1.AllOrders);
router.get("/order/:id", orders_1.SingalOrder);
router.delete("/delete/order/:id", orders_1.DeleteOrder);
router.get("/user/:id", orders_1.Profile);
router.put("/update/user/:id", upload.any(), orders_1.EditProfile);
exports.default = router;
