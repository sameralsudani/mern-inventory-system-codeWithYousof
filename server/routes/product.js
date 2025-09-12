import express from "express";
import multer from "multer";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.post("/add", upload.single("imageFile"), authMiddleware, addProduct);
router.get("/", authMiddleware, getProducts);
router.put("/:id", upload.single("imageFile"), authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
