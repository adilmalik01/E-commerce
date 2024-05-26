"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import multer from 'multer'
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
// const storageConfig = multer.diskStorage({
//     destination: './uploads/',
//     filename: function (req: any, file, cb) {
//         cb(null, `${new Date().getTime()}-${file.originalname}`)
//     },
// })
// var upload = multer({ storage: storageConfig })
router.post("/signup", auth_1.Signup);
router.post("/login", auth_1.Login);
router.post("/logout", auth_1.Logout);
router.get("/allusers", auth_1.AllUsers);
router.post("/forget-password", auth_1.forgetPassowrd);
router.post("/otp-send", auth_1.ReceivedOtp);
router.post("/reset-password", auth_1.updatePassword);
exports.default = router;
