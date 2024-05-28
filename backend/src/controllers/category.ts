import { Request, Response } from "express";
import slugify from "slugify";
import client, { db } from "../database/mongodb";
import { ObjectId } from "mongodb";
let category_db: any = client.db("e-commerce").collection("category");

// --------------------- CREATE ----------------------------------------
export const Create_Category = async (req: Request, res: Response) => {
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
    let slug = slugify(name);
    let store_category = await category_db.insertOne({
      category: name,
      category_slug: slug,
    });
    res.send({ message: "category Created" });
  } catch (e) {
    console.log(e);
    res.send({ error: e, message: "error in category" });
  }
};

// --------------------- READ ----------------------------------------
export const all_Category = async (req: Request, res: Response) => {
  try {
    let result = await category_db.find({});
    let cursor = await result.toArray();
    res.send(cursor);
  } catch (e) {
    res.send({ error: e, message: "error in get all" });
  }
};

// --------------------- UPDATE ----------------------------------------
export const update_Category = async (req: Request, res: Response) => {
  let param: string = req.params.id;
  let { name } = req.body;
  if (!name) {
    res.send({ message: "Provide Name" });
    return;
  }
  if (!ObjectId.isValid(param)) {
    res.send({ message: "please Provide Valid Id" });
  }
  let updateSlug: any = slugify(name);
  try {
    let result: any = await category_db.updateOne(
      { _id: new ObjectId(param) },
      { $set: { category: name, category_slug: updateSlug } }
    );
    res.send(result);
  } catch (e) {
    res.send({ error: e, message: "error in get all" });
  }
};

// --------------------- DELETE ----------------------------------------
export const delete_Category = async (req: Request, res: Response) => {
  let param: string = req.params.id;

  try {
    let result = await category_db.deleteOne({ _id: new ObjectId(param) });
    if (result.deletedCount === 0) {
      res.status(404).send({ message: "Category not found" });
    } else {
      res.send("Deleted Successfully");
    }
  } catch (e) {
    res.status(500).send({ error: e, message: "Error in delete operation" });
  }
};
