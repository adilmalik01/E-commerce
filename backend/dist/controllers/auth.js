"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.ReceivedOtp = exports.forgetPassowrd = exports.AllUsers = exports.Logout = exports.Login = exports.Signup = void 0;
const mongodb_1 = __importDefault(require("../database/mongodb"));
// import { stringToHash } from 'bcrypt-inzi';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const mailgen_1 = __importDefault(require("mailgen"));
const db = mongodb_1.default.db("e-commerce").collection("users");
const otpDb = mongodb_1.default.db("e-commerce").collection("OTP");
const Signup = async (req, res) => {
    if (!req.body.email ||
        !req.body.password ||
        !req.body.fullName) {
        res.status(401);
        res.send(`require parammetter is missing 
             "please provide require input"
            `);
        return;
    }
    ;
    let userData = req.body;
    userData.email = userData.email.toLowerCase();
    // const hashPass = await stringToHash(userData.password);
    let result = await db.findOne({ email: userData.email });
    if (result) {
        res.send({ msg: "already exist Nic" });
        return;
    }
    else {
        const insertData = await db.insertOne({
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password,
            isAdmin: false,
            profileAvatar: "https://th.bing.com/th/id/OIP.VTn0NAxal8BSB5W3ZTSdUAHaHT?w=186&h=184&c=7&r=0&o=5&pid=1.7",
            createdAt: (0, moment_1.default)().format("MMMM Do YYYY,")
        });
        res.status(200).send({ msg: "Signup Succesfully" });
    }
};
exports.Signup = Signup;
const Login = async (req, res) => {
    if (!req.body.email ||
        !req.body.password) {
        res.status(401);
        res.send(`require parammetter is missing 
             "please provide require input"
            `);
        return;
    }
    ;
    let userData = req.body;
    userData.email = userData.email.toLowerCase();
    try {
        let result = await db.findOne({ email: userData.email });
        if (result) {
            let isMatch = result.password === userData.password;
            if (isMatch) {
                let token = jsonwebtoken_1.default.sign({
                    fullName: result.fullName,
                    email: result.email,
                    isAdmin: result.isAdmin,
                    _id: result._id,
                    avatar: result.profileAvatar,
                }, "adilmalik");
                res.cookie("token", token, {
                    secure: true,
                    httpOnly: true,
                    expires: new Date(Date.now() + 86400000)
                });
                res.send("Your are login succecfully");
            }
            else {
                res.status(403).send("Password and email is Incorrect");
            }
        }
        else {
            res.status(403).send("Password and email is Incorrect");
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.Login = Login;
const Logout = async (req, res) => {
    res.cookie("token", "", {
        secure: true,
        httpOnly: true
    });
    res.send("succes");
};
exports.Logout = Logout;
const AllUsers = async (req, res) => {
    try {
        const response = db.find({});
        let cursor = await response.toArray();
        res.send(cursor);
    }
    catch (e) {
        console.log(e);
    }
};
exports.AllUsers = AllUsers;
const forgetPassowrd = async (req, res) => {
    let { email } = req.body;
    if (!email) {
        console.log("required field missing");
        res.status(403).send("required field missing");
        return;
    }
    try {
        let isMatch = await db.findOne({ email: email });
        if (isMatch) {
            let otp = otp_generator_1.default.generate(6, {
                digits: true, // Include digits
                lowerCaseAlphabets: false, // Exclude lower case alphabets
                upperCaseAlphabets: false, // Exclude upper case alphabets
                specialChars: false // Exclude special characters
            });
            console.log(otp);
            const config = {
                service: 'gmail',
                auth: {
                    user: 'malikadil5679@gmail.com',
                    pass: 'fwcikjybpmfvvwzl'
                }
            };
            const transporter = nodemailer_1.default.createTransport(config);
            let MailGenerator = new mailgen_1.default({
                theme: "default",
                product: {
                    name: "UNIQLO",
                    link: "http://localhost:3000",
                    logo: "https://path-to-your-logo/logo.png" // optional: add a logo
                }
            });
            // Define the email content
            let response = {
                body: {
                    name: email, // Adds the user's name to the email
                    intro: "You have received this email because a password reset request for your account was received.",
                    action: {
                        instructions: 'Please use the following OTP to reset your password:',
                        button: {
                            color: '#22BC66', // Optional action button color
                            text: `Your OTP Code: ${otp}`,
                        }
                    },
                    outro: "If you did not request a password reset, please ignore this email or contact support if you have questions."
                }
            };
            // Generate the HTML content
            let mail = MailGenerator.generate(response);
            // Define the message object
            let message = {
                from: 'malikadil5679@gmail.com',
                to: email,
                subject: "Forget Password",
                html: mail
            };
            // Send the email
            async function sendEmail() {
                try {
                    let sendEmail = await transporter.sendMail(message);
                    console.log('Email sent:', sendEmail);
                }
                catch (error) {
                    console.error('Error sending email:', error);
                }
            }
            sendEmail();
            const insertOTP = await otpDb.insertOne({
                email: email,
                otpCode: otp
            });
            res.send({ message: "OTP SEND SUCCESFULLY", status: "sucess" });
        }
        else {
            res.status(400).send({
                message: "User NOT Found", status: "error"
            });
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.forgetPassowrd = forgetPassowrd;
const ReceivedOtp = async (req, res) => {
    let { otp, email } = req.body;
    if (!email || !otp) {
        console.log("required field missing");
        res.status(403).send("required field missing");
        return;
    }
    try {
        const result = await otpDb.find({ email: req.body.email }).sort({ _id: -1 }).limit(1).toArray();
        if (result[0].otpCode == otp) {
            res.status(200).send({
                message: "OTP CORRECT", status: "succes"
            });
            return;
        }
        else {
            res.status(400).send({
                message: "Invalid OTP", status: "error"
            });
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.ReceivedOtp = ReceivedOtp;
const updatePassword = async (req, res) => {
    let { password, email } = req.body;
    if (!email || !password) {
        console.log("required field missing");
        res.status(403).send("required field missing");
        return;
    }
    try {
        const isMatch = await db.findOne({ email: email });
        if (isMatch) {
            let response = await db.updateOne({ email: isMatch.email }, // Query document
            { $set: { password: password } } // Update document
            );
            if (response.modifiedCount == 1) {
                res.status(200).send({
                    message: "Password Forget Successfully", status: "succes"
                });
            }
            return;
        }
        else {
            res.status(400).send({
                message: "Invalid OTP", status: "error"
            });
        }
    }
    catch (e) {
        console.log(e);
    }
};
exports.updatePassword = updatePassword;
