import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addOrder, getOrders, placeOrder } from '../controllers/orderController.js';

const router = express.Router();

router.get('/:id', authMiddleware, getOrders);
router.post('/add', authMiddleware, addOrder);
router.post("/place-order", authMiddleware, placeOrder);


export default router 