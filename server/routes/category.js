import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import {addCategory, getCategory, updateCategory, deleteCategory} from '../controllers/categoryController.js';
import multer from "multer";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.get('/', authMiddleware, getCategory);
router.post('/add', authMiddleware, upload.single('imageFile'), addCategory);
router.put('/:id', authMiddleware, upload.single('imageFile'), updateCategory); 
router.delete('/:id', authMiddleware, deleteCategory);

export default router 