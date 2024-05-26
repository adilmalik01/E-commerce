"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = require("../controllers/product");
const mongodb_1 = __importDefault(require("../database/mongodb"));
let category_db = mongodb_1.default.db("e-commerce").collection("category");
const router = express_1.default.Router();
router.get("/allproducts", product_1.Allproducts);
router.get("/product/:id", product_1.singalProduct);
router.post("/filter-product", product_1.filterdProduct);
router.get("/categorys", async function (req, res) {
    try {
        let result = await category_db.find({});
        let cursor = await result.toArray();
        res.send(cursor);
    }
    catch (e) {
        res.send({ error: e, message: "error in get all" });
    }
});
exports.default = router;
