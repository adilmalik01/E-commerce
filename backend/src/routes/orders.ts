import express from 'express'
import { AddOrders, AdminOrderDetail, AllOrders, DeleteOrder, EditProfile, Profile, SingalOrder } from '../controllers/orders';
import multer from 'multer';


const router = express.Router()
const storageConfig = multer.diskStorage({
    destination: './uploads/',
    filename: function (req: any, file, cb) {
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    },
})

var upload = multer({ storage: storageConfig })




router.post("/addorder", AddOrders)
router.get("/all-orders", AllOrders)
router.get("/order/:id", SingalOrder)
router.get("/admin-order/:id", AdminOrderDetail)
router.delete("/delete/order/:id", DeleteOrder)

router.get("/user/:id", Profile)
router.put("/update/user/:id", upload.any(), EditProfile)


export default router;
