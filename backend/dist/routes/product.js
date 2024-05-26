"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const product_1 = require("../controllers/product");
const router = express_1.default.Router();
const storageConfig = multer_1.default.diskStorage({
    destination: "./uploads/",
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.originalname}`);
    },
});
var upload = (0, multer_1.default)({ storage: storageConfig });
router.post("/addproduct", upload.any(), product_1.addProduct);
router.delete("/delete-product/:id", product_1.DeleteProduct);
exports.default = router;
