import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import dbconnect from "./DB/dbconnection.js";
import authRoutes from "./routes/authuser.js";
import messageRoutes from './routes/messageRoute.js';
import userRoutes from "./routes/userRoute.js";
import { app, server } from "./socket/socket.js";

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      /^http:\/\/localhost:\d+$/,
      /^https:\/\/.*\.vercel\.app$/,
    ];
    if (!origin || allowed.some((o) => o.test(origin))) {
      cb(null, true);
    } else {
      cb(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json());        // ← MUST be before routes
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/user', userRoutes);

app.get("/", (req, res) => {
  res.send("Connectify API is running 🚀 (v2 - CORS updated)");
});

// ─── Start ───────────────────────────────────────────────────
server.listen(process.env.PORT, () => {
  dbconnect();
  console.log(`Server is running on port ${process.env.PORT}`);
});