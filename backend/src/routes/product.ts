import express from "express";
import multer from "multer";
import { DeleteProduct, addProduct, update_Product } from "../controllers/product";

const router = express.Router();

const storageConfig = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req: any, file, cb) {
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  },
});

var upload = multer({ storage: storageConfig });

router.post("/addproduct", upload.any(), addProduct);
router.delete("/delete-product/:id", DeleteProduct);
router.put("/update-product/:id", upload.any(), update_Product);

export default router;
