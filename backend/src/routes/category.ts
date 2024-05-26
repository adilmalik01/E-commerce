import express from 'express'
import { Create_Category, all_Category, delete_Category, update_Category } from '../controllers/category'

const router = express.Router()

router.post("/create-category", Create_Category)
router.get("/all-category", all_Category)
router.put("/update-category/:id", update_Category)
router.delete("/delete-category/:id", delete_Category)


export default router
