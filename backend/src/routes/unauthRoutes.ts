import express, { Request, Response } from "express";
import {
  Allproducts,
  HomePage,
  filterdProduct,
  singalProduct,
} from "../controllers/product";
import client from "../database/mongodb";
let category_db: any = client.db("e-commerce").collection("category");

const router = express.Router();

router.get("/allproducts", Allproducts);
router.get("/product/:id", singalProduct);
router.post("/filter-product", filterdProduct);
router.get("/arrival-product/:query", HomePage);
// router.post("/arrival-product", filterdProduct);


router.get("/categorys", async function (req: Request, res: Response) {
  try {
    let result = await category_db.find({});
    let cursor = await result.toArray();
    res.send(cursor);
  } catch (e) {
    res.send({ error: e, message: "error in get all" });
  }
});

export default router;
