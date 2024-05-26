"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProduct = exports.filterdProduct = exports.singalProduct = exports.Allproducts = exports.addProduct = void 0;
const mongodb_1 = __importDefault(require("../database/mongodb"));
const cloudinary_1 = require("cloudinary");
const db = mongodb_1.default.db("e-commerce").collection("products");
const fs_1 = __importDefault(require("fs"));
const mongodb_2 = require("mongodb");
cloudinary_1.v2.config({
    cloud_name: "dxmi7wlcc",
    api_key: "314487955484986",
    api_secret: "OAto_nrC_7Hc4GAeyqHyAyPQTKU",
});
async function addProduct(req, res) {
    try {
        let imgResult = await cloudinary_1.v2.uploader.upload(req.files[0].path);
        let productData = {
            productName: req.body.productName,
            productBrand: req.body.productBrand,
            productSection: req.body.productSection,
            productPrice: Number(req.body.productPrice),
            productDetail: req.body.productDetail,
            productCategory: req.body.productCategory,
            CandinateAvatar: imgResult.secure_url,
        };
        let resp = await db.insertOne(productData);
        try {
            fs_1.default.unlinkSync(req.files[0].path);
            //file removed
        }
        catch (err) {
            console.error(err);
        }
        res.send(resp);
    }
    catch (e) {
        console.log(e);
    }
}
exports.addProduct = addProduct;
const Allproducts = async (req, res) => {
    try {
        const response = db.find({});
        let cursor = await response.toArray();
        res.send(cursor);
    }
    catch (e) {
        console.log(e);
    }
};
exports.Allproducts = Allproducts;
const singalProduct = async (req, res) => {
    let param = req.params.id;
    try {
        const response = db.find({ _id: new mongodb_2.ObjectId(param) }, {});
        let cursor = await response.toArray();
        res.send(cursor);
    }
    catch (e) {
        console.log(e);
    }
};
exports.singalProduct = singalProduct;
const filterdProduct = async (req, res) => {
    try {
        let { radio, checked } = req.body;
        if (!Array.isArray(checked))
            checked = [];
        if (!Array.isArray(radio))
            radio = [];
        let query = {};
        // Check if there are categories to filter
        if (checked.length > 0) {
            query.productCategory = { $in: checked };
        }
        // Check if price range is provided
        if (radio.length === 2 && !isNaN(radio[0]) && !isNaN(radio[1])) {
            query.productPrice = { $gte: radio[0], $lte: radio[1] };
        }
        const result = await db.find(query);
        const products = await result.toArray();
        res.status(200).json({
            success: true,
            products: products,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while filtering",
            error: error,
        });
    }
};
exports.filterdProduct = filterdProduct;
const DeleteProduct = async (req, res) => {
    let param = req.params.id;
    try {
        const response = db.deleteOne({ _id: new mongodb_2.ObjectId(param) });
        res.send("Delete Successfully");
    }
    catch (e) {
        console.log(e);
    }
};
exports.DeleteProduct = DeleteProduct;
