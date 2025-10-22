import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from 'multer';
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';


dotenv.config();
connectDB();

const app = express();
const upload = multer();

app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true, // ✅ allow cookies
   methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use("/api/users",upload.none(), userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => res.send("API is running..."));
// router.get('/profile', protect, (req, res) => res.json(req.user));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
