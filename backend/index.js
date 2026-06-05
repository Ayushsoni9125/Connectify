import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbconnect from "./DB/dbconnection.js";
import authRoutes from "./routes/authuser.js";
import messageRoutes from './routes/messageRoute.js';
import userRoutes from "./routes/userRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/user', userRoutes);

app.get("/", (req, res) => {
  res.send("Connectify API is running 🚀");
});

app.listen(process.env.PORT, () => {
  dbconnect();
  console.log(`Server is running on port ${process.env.PORT}`);
});