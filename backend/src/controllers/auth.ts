import { Request, Response } from 'express'
import client from '../database/mongodb';
// import { stringToHash } from 'bcrypt-inzi';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import nodemailer from "nodemailer"
import otpGenerator from 'otp-generator';
import Mailgen from 'mailgen';
import { ObjectId } from 'mongodb';


const db = client.db("e-commerce").collection("users");
const otpDb = client.db("e-commerce").collection("OTP");

export const Signup = async (req: Request, res: Response) => {

    if (
        !req.body.email ||
        !req.body.password ||
        !req.body.fullName
    ) {
        res.status(401)
        res.send(
            `require parammetter is missing 
             "please provide require input"
            `
        )
        return;
    };

    let userData = req.body
    userData.email = userData.email.toLowerCase()

    // const hashPass = await stringToHash(userData.password);
    let result = await db.findOne({ email: userData.email })
    if (result) {
        res.send({ msg: "already exist Nic" })
        return;
    }
    else {
        const insertData = await db.insertOne(
            {
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password,
                isAdmin: false,
                profileAvatar: "https://th.bing.com/th/id/OIP.VTn0NAxal8BSB5W3ZTSdUAHaHT?w=186&h=184&c=7&r=0&o=5&pid=1.7",
                createdAt: moment().format("MMMM Do YYYY,")
            }
        )
        res.status(200).send({ msg: "Signup Succesfully" })
    }
}



export const Login = async (req: Request, res: Response) => {
    if (
        !req.body.email ||
        !req.body.password
    ) {
        res.status(401)
        res.send(
            `require parammetter is missing 
             "please provide require input"
            `
        )
        return;
    };
    let userData = req.body
    userData.email = userData.email.toLowerCase()

    try {
        let result: any = await db.findOne({ email: userData.email })

        if (result) {
            let isMatch = result.password === userData.password
            if (isMatch) {


                let token = jwt.sign({
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
                })

                res.send("Your are login succecfully")

            } else {
                res.status(403).send("Password and email is Incorrect")
            }
        } else {
            res.status(403).send("Password and email is Incorrect")
        }

    }
    catch (e) {
        console.log(e);
    }
}


export const Logout = async (req: Request, res: Response) => {

    res.cookie("token", "", {
        secure: true,
        httpOnly: true
    })
    res.send("succes")

}


export const AllUsers = async (req: Request, res: Response) => {
    try {
        const response = db.find({})
        let cursor = await response.toArray()
        res.send(cursor)
    }
    catch (e) {
        console.log(e);
    }
}



export const forgetPassowrd = async (req: Request, res: Response) => {
    let { email } = req.body
    if (!email) {
        console.log("required field missing");
        res.status(403).send("required field missing");
        return;
    }
    try {
        let isMatch = await db.findOne({ email: email })
        if (isMatch) {
            let otp = otpGenerator.generate(6, {
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

            const transporter: any = nodemailer.createTransport(config)


            let MailGenerator = new Mailgen({
                theme: "default",
                product: {
                    name: "UNIQLO",
                    link: "http://localhost:3000",
                    logo: "https://path-to-your-logo/logo.png"  // optional: add a logo
                }
            });

            // Define the email content
            let response: any = {
                body: {
                    name: email,  // Adds the user's name to the email
                    intro: "You have received this email because a password reset request for your account was received.",
                    action: {
                        instructions: 'Please use the following OTP to reset your password:',
                        button: {
                            color: '#22BC66',  // Optional action button color
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
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            }
            sendEmail();


            const insertOTP = await otpDb.insertOne(
                {
                    email: email,
                    otpCode: otp
                }
            )

            res.send({ message: "OTP SEND SUCCESFULLY", status: "sucess" })
        } else {
            res.status(400).send({
                message: "User NOT Found", status: "error"
            })
        }
    }
    catch (e) {
        console.log(e);
    }
}




export const ReceivedOtp = async (req: Request, res: Response) => {
    let { otp, email }: any = req.body
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
            })
            return
        } else {
            res.status(400).send({
                message: "Invalid OTP", status: "error"
            })
        }
    }
    catch (e) {
        console.log(e);
    }
}


export const updatePassword = async (req: Request, res: Response) => {
    let { password, email }: any = req.body
    if (!email || !password) {
        console.log("required field missing");
        res.status(403).send("required field missing");
        return;
    }
    try {
        const isMatch = await db.findOne({ email: email })
        if (isMatch) {
            let response = await db.updateOne(
                { email: isMatch.email }, // Query document
                { $set: { password: password } } // Update document
            );
            if (response.modifiedCount == 1) {
                res.status(200).send({
                    message: "Password Forget Successfully", status: "succes"
                })
            }
            return
        } else {
            res.status(400).send({
                message: "Invalid OTP", status: "error"
            })
        }
    }
    catch (e) {
        console.log(e);
    }
}

export const delete_User = async (req: Request, res: Response) => {
    let param: string = req.params.id;
    console.log(param);

    try {
        let result = await db.deleteOne({ _id: new ObjectId(param) });
        if (result.deletedCount === 0) {
            res.status(404).send({ message: "Category not found" });
        } else {
            res.send("Deleted Successfully");
        }
    } catch (e) {
        res.status(500).send({ error: e, message: "Error in delete operation" });
    }
};



export const update_user = async (req: Request, res: Response) => {
    let param: string = req.params.id;
    let { status } = req.body;
    console.log(typeof status);


    let statusInbolean = status == "true" ? true : false
    console.log(statusInbolean);
    if (!status) {
        res.send({ message: "Provide Name" });
        return;
    }
    if (!ObjectId.isValid(param)) {
        res.send({ message: "please Provide Valid Id" });
    }
    try {
        let result: any = await db.updateOne(
            { _id: new ObjectId(param) },
            { $set: { isAdmin: statusInbolean } }
        );

        res.send(result);

    } catch (e) {
        res.send({ error: e, message: "error in get all" });
    }
};