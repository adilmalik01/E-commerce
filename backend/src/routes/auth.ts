import express from 'express'
// import multer from 'multer'
import { Login, Logout, Signup, AllUsers, forgetPassowrd, ReceivedOtp, updatePassword } from '../controllers/auth'


const router = express.Router()

// const storageConfig = multer.diskStorage({
//     destination: './uploads/',
//     filename: function (req: any, file, cb) {
//         cb(null, `${new Date().getTime()}-${file.originalname}`)
//     },
// })

// var upload = multer({ storage: storageConfig })


router.post("/signup", Signup)
router.post("/login", Login)
router.post("/logout", Logout)
router.get("/allusers", AllUsers)
router.post("/forget-password", forgetPassowrd)
router.post("/otp-send", ReceivedOtp)
router.post("/reset-password", updatePassword)


export default router;
