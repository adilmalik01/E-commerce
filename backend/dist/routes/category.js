"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_1 = require("../controllers/category");
const router = express_1.default.Router();
router.post("/create-category", category_1.Create_Category);
router.get("/all-category", category_1.all_Category);
router.put("/update-category/:id", category_1.update_Category);
router.delete("/delete-category/:id", category_1.delete_Category);
exports.default = router;
