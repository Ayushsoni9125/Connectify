import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import dbconnect from "./DB/dbconnection.js";
import authRoutes from "./routes/authuser.js";
import messageRoutes from './routes/messageRoute.js';
import userRoutes from "./routes/userRoute.js";
import { app, server } from "./socket/socket.js";

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/user', userRoutes);

app.get("/", (req, res) => {
  res.send("Connectify API is running 🚀");
});

server.listen(process.env.PORT, () => {
  dbconnect();
  console.log(`Server is running on port ${process.env.PORT}`);
});