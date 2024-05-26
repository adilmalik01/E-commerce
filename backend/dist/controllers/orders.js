"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditProfile = exports.Profile = exports.DeleteOrder = exports.SingalOrder = exports.AllOrders = exports.AddOrders = void 0;
const mongodb_1 = __importDefault(require("../database/mongodb"));
const moment_1 = __importDefault(require("moment"));
const cloudinary_1 = require("cloudinary");
const mongodb_2 = require("mongodb");
const db = mongodb_1.default.db("e-commerce").collection("orders");
const userCollection = mongodb_1.default.db("e-commerce").collection("users");
cloudinary_1.v2.config({
    cloud_name: 'dxmi7wlcc',
    api_key: '314487955484986',
    api_secret: 'OAto_nrC_7Hc4GAeyqHyAyPQTKU'
});
async function AddOrders(req, res) {
    const { cart, userInfo } = req.body;
    try {
        let orderData = {
            orderProduct: cart,
            userInfo: userInfo,
            userName: req.body.currentUser.fullName,
            userId: req.body.currentUser._id,
            createdAt: (0, moment_1.default)().format('MMMM Do YYYY, h:mm:ss a')
        };
        let resp = await db.insertOne(orderData);
        // Emit new order notification
        if (req.io) {
            req.io.emit('newOrder', orderData);
        }
        res.send(resp);
    }
    catch (e) {
        console.log(e);
    }
}
exports.AddOrders = AddOrders;
const AllOrders = async (req, res) => {
    try {
        const response = db.find({});
        let cursor = await response.toArray();
        res.send(cursor);
    }
    catch (e) {
        console.log(e);
    }
};
exports.AllOrders = AllOrders;
const SingalOrder = async (req, res) => {
    let param = req.params.id;
    try {
        const response = await db.find({ userId: param }, {});
        let cursor = await response.toArray();
        res.send(cursor);
    }
    catch (e) {
        console.log(e);
    }
};
exports.SingalOrder = SingalOrder;
const DeleteOrder = async (req, res) => {
    let param = req.params.id;
    try {
        const response = await db.deleteOne({ _id: new mongodb_2.ObjectId(param) });
        if (response.deletedCount === 1) {
            res.send("delete successfully");
        }
        else {
            res.status(404).send("User not found");
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.DeleteOrder = DeleteOrder;
// PROFILE ROUTES
const Profile = async (req, res) => {
    let param = req.params.id;
    try {
        const response = userCollection.find({ _id: new mongodb_2.ObjectId(param) }, {});
        let cursor = await response.toArray();
        res.send(cursor);
    }
    catch (e) {
        console.log(e);
    }
};
exports.Profile = Profile;
const EditProfile = async (req, res) => {
    let param = req.params.id;
    let { updateText } = req.body;
    try {
        if (!param || !mongodb_2.ObjectId.isValid(param)) {
            return res.status(400).send("Invalid user ID");
        }
        let user = await userCollection.findOne({ _id: new mongodb_2.ObjectId(param) });
        if (!user) {
            return res.status(404).send("User not found");
        }
        let updateFields = { fullName: updateText };
        if (req.files && req.files.length > 0) {
            let imgResult = await cloudinary_1.v2.uploader.upload(req.files[0].path);
            updateFields.profileAvatar = imgResult.secure_url;
        }
        let response = await userCollection.updateOne({ _id: new mongodb_2.ObjectId(param) }, { $set: updateFields });
        if (response.modifiedCount === 1) {
            res.send("Profile updated successfully");
        }
        else {
            res.status(404).send("User not found");
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
};
exports.EditProfile = EditProfile;
