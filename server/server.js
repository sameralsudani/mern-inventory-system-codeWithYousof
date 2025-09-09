import express from "express";
import cors from 'cors';
import authRouter from "./routes/auth.js";
import categoryRouter from './routes/category.js';
import supplierRouter from './routes/supplier.js';
import productRouter from './routes/product.js';
import userRouter from './routes/user.js';
import orderRouter from './routes/order.js';
import dashboardRouter from './routes/dashboard.js';

import connectToMongoDB from "./db/connectToMongoDB.js";

const app = express()

const allowedOrigins = [
	'http://localhost:5173', // For local development
	'https://mern-inventory-system-code-with-you-phi.vercel.app' // Replace with your actual Vercel frontend URL
];

app.use(express.static('public'));
app.use(cors({
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) === -1) {
			const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
			return callback(new Error(msg), false);
		}
		return callback(null, true);
	},
	credentials: false // Important if you are sending cookies or authorization headers
}));app.use(express.json());

app.use("/api/dashboard", dashboardRouter);
app.use("/api/auth", authRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/category", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/order", orderRouter);

app.listen(process.env.PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${process.env.PORT}`);
});
