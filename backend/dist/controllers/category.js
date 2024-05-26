"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_Category = exports.update_Category = exports.all_Category = exports.Create_Category = void 0;
const slugify_1 = __importDefault(require("slugify"));
const mongodb_1 = __importDefault(require("../database/mongodb"));
const mongodb_2 = require("mongodb");
let category_db = mongodb_1.default.db("e-commerce").collection("category");
// --------------------- CREATE ----------------------------------------
const Create_Category = async (req, res) => {
    let { name } = req.body;
    if (!name) {
        res.send({ message: "Provide Name" });
        return;
    }
    try {
        let check = await category_db.findOne({ category: name });
        if (check) {
            res.send({ message: "Already Exist Category" });
            return;
        }
        let slug = (0, slugify_1.default)(name);
        let store_category = await category_db.insertOne({
            category: name,
            category_slug: slug,
        });
        res.send({ message: "category Created" });
    }
    catch (e) {
        console.log(e);
        res.send({ error: e, message: "error in category" });
    }
};
exports.Create_Category = Create_Category;
// --------------------- READ ----------------------------------------
const all_Category = async (req, res) => {
    try {
        let result = await category_db.find({});
        let cursor = await result.toArray();
        res.send(cursor);
    }
    catch (e) {
        res.send({ error: e, message: "error in get all" });
    }
};
exports.all_Category = all_Category;
// --------------------- UPDATE ----------------------------------------
const update_Category = async (req, res) => {
    let param = req.params.id;
    let { name } = req.body;
    if (!name) {
        res.send({ message: "Provide Name" });
        return;
    }
    if (!mongodb_2.ObjectId.isValid(param)) {
        res.send({ message: "please Provide Valid Id" });
    }
    let updateSlug = (0, slugify_1.default)(name);
    try {
        let result = await category_db.updateOne({ _id: new mongodb_2.ObjectId(param) }, { $set: { category: name, category_slug: updateSlug } });
        res.send(result);
    }
    catch (e) {
        res.send({ error: e, message: "error in get all" });
    }
};
exports.update_Category = update_Category;
// --------------------- DELETE ----------------------------------------
const delete_Category = async (req, res) => {
    let param = req.params.id;
    try {
        let result = await category_db.deleteOne({});
        res.send("Deleted SuccessFully");
    }
    catch (e) {
        res.send({ error: e, message: "error in get all" });
    }
};
exports.delete_Category = delete_Category;
