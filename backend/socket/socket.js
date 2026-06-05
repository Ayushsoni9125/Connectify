import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    /^http:\/\/localhost:\d+$/,
    /^https:\/\/.*\.vercel\.app$/,
];

const io = new Server(server, {
    cors: {
        origin: (origin, cb) => {
            if (!origin || allowedOrigins.some((o) => o.test(origin))) {
                cb(null, true);
            } else {
                cb(new Error(`CORS blocked: ${origin}`));
            }
        },
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Map: userId -> socketId
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    console.log(`Socket connected: ${socket.id} (user: ${userId})`);

    // Broadcast online users list to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
