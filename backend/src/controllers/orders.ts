import { Request, Response } from "express";
import client from '../database/mongodb';
import moment from "moment";
import { v2 as cloudinary } from 'cloudinary';
import { ObjectId } from "mongodb";
import { Server as SocketIoServer } from 'socket.io';
import fs from "fs"

const db = client.db("e-commerce").collection("orders");
const userCollection = client.db("e-commerce").collection("users");

cloudinary.config({
    cloud_name: 'dxmi7wlcc',
    api_key: '314487955484986',
    api_secret: 'OAto_nrC_7Hc4GAeyqHyAyPQTKU'
});

interface RequestWithIO extends Request {
    io?: SocketIoServer;
}

export async function AddOrders(req: RequestWithIO, res: Response) {
    const { cart, userInfo, totalPrice } = req.body;
    try {
        let orderData = {
            orderProduct: cart,
            userInfo: userInfo,
            totalPrice: totalPrice,
            userName: req.body.currentUser.fullName,
            userId: req.body.currentUser._id,
            createdAt: moment().format('MMMM Do YYYY, h:mm:ss a')
        };
        let resp = await db.insertOne(orderData);

        // Emit new order notification
        if (req.io) {
            req.io.emit('newOrder', orderData);
        }

        res.send(resp);
    } catch (e) {
        console.log(e);
    }
}

export const AllOrders = async (req: Request, res: Response) => {
    try {
        const response = db.find({});
        let cursor = await response.toArray();
        res.send(cursor);
    } catch (e) {
        console.log(e);
    }
};

export const SingalOrder = async (req: Request, res: Response) => {
    let param = req.params.id;
    try {
        const response = await db.find({ userId: param }, {});
        let cursor = await response.toArray();
        res.send(cursor);
    } catch (e) {
        console.log(e);
    }
};



export const AdminOrderDetail = async (req: Request, res: Response) => {
    let param = req.params.id;
    try {
        const response = await db.find({ _id: new ObjectId(param) }, {});
        let cursor = await response.toArray();
        res.send(cursor);
    } catch (e) {
        console.log(e);
    }
};




export const DeleteOrder = async (req: Request, res: Response) => {
    let param = req.params.id;
    try {
        const response = await db.deleteOne({ _id: new ObjectId(param) });
        if (response.deletedCount === 1) {
            res.send("delete successfully");
        } else {
            res.status(404).send("User not found");
        }
    } catch (e) {
        console.log(e);
    }
};

// PROFILE ROUTES

export const Profile = async (req: Request, res: Response) => {
    let param = req.params.id;
    try {
        const response = userCollection.find({ _id: new ObjectId(param) }, {});
        let cursor = await response.toArray();
        res.send(cursor);
    } catch (e) {
        console.log(e);
    }
};

export const EditProfile = async (req: Request, res: Response) => {
    let param = req.params.id;
    let { updateText } = req.body;
    try {
        if (!param || !ObjectId.isValid(param)) {
            return res.status(400).send("Invalid user ID");
        }

        let user = await userCollection.findOne({ _id: new ObjectId(param) });
        if (!user) {
            return res.status(404).send("User not found");
        }

        let updateFields: any = { fullName: updateText };

        if (req.files && (req.files as unknown as File[]).length > 0) {
            let imgResult = await cloudinary.uploader.upload(req.files[0].path);
            updateFields.profileAvatar = imgResult.secure_url;
        }

        let response = await userCollection.updateOne(
            { _id: new ObjectId(param) },
            { $set: updateFields }
        );

        if (response.modifiedCount === 1) {
            res.send("Profile updated successfully");
        } else {
            res.status(404).send("User not found");
        }
        fs.unlinkSync(req.files[0].path);
        //file removed
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
};
