import { Request, response, Response } from "express";
import client from "../database/mongodb";
import { v2 as cloudinary } from "cloudinary";
const db = client.db("e-commerce").collection("products");
import fs from "fs";
import { ObjectId } from "mongodb";

cloudinary.config({
  cloud_name: "dxmi7wlcc",
  api_key: "314487955484986",
  api_secret: "OAto_nrC_7Hc4GAeyqHyAyPQTKU",
});

export async function addProduct(req: Request, res: Response) {
  try {
    let imgResult = await cloudinary.uploader.upload(req.files[0].path);
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

    fs.unlinkSync(req.files[0].path);
    //file removed
    res.send(resp);
  } catch (e) {
    console.log(e);
  }
}

export const Allproducts = async (req: Request, res: Response) => {
  try {
    const response = db.find({});
    let cursor = await response.toArray();
    res.send(cursor);
  } catch (e) {
    console.log(e);
  }
};

export const singalProduct = async (req: Request, res: Response) => {
  let param = req.params.id;
  try {
    const response = db.find({ _id: new ObjectId(param) }, {});
    let cursor = await response.toArray();
    res.send(cursor);
  } catch (e) {
    console.log(e);
  }
};

export const filterdProduct = async (req: Request, res: Response) => {
  try {
    let { radio, checked } = req.body;

    if (!Array.isArray(checked)) checked = [];
    if (!Array.isArray(radio)) radio = [];

    let query: any = {};

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while filtering",
      error: error,
    });
  }
};

export const DeleteProduct = async (req: Request, res: Response) => {
  let param = req.params.id;
  try {
    const response = db.deleteOne({ _id: new ObjectId(param) });
    res.send("Delete Successfully");
  } catch (e) {
    console.log(e);
  }
};


export const update_Product = async (req: Request, res: Response) => {
  let param: string = req.params.id;
  let { productName, productBrand, productSection, productPrice, productCategory, productDetail, productImage } = req.body
  const existingDocument = await db.findOne({ _id: new ObjectId(param) });
  if (!existingDocument) {
    return res.status(404).send({ message: "Document not found" });
  }

  try {
    let UpdateData: any = {
      productName: productName,
      productBrand: productBrand,
      productSection: productSection,
      productPrice: productPrice,
      productCategory: productCategory,
      productDetail: productDetail,
    }
    if (productImage) {
      UpdateData.CandinateAvatar = productImage
    } else {
      let imgResult = await cloudinary.uploader.upload(req.files[0].path);
      UpdateData.CandinateAvatar = imgResult.secure_url
    }
    if (!ObjectId.isValid(param)) {
      res.send({ message: "please Provide Valid Id" });
    }

    let result: any = await db.updateOne(
      { _id: new ObjectId(param) },
      { $set: { ...UpdateData } }
    );
    if (result.modifiedCount === 1) {
      return res.status(200).send({ message: "Document updated successfully" });
    } else {
      return res.status(500).send({ message: "Failed to update document" });
    }
    // res.send(result);
    fs.unlinkSync(req.files[0].path);
    //file removed
  } catch (e) {
    res.send({ error: e, message: "error in get all" });
  }
};



export const HomePage = async (req: Request, res: Response) => {
  let para = req.params.query
  try {
    const response = db.find({ productSection: para }, {}).limit(8).sort({ _id: -1 })
    let cursor = await response.toArray()
    res.send(cursor);
  } catch (e) {
    console.log(e);
  }
};