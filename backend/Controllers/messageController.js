import Conversation from "../Models/conversation.js";
import Message from "../Models/message.js";
import { io, getReceiverSocketId } from "../socket/socket.js";

export const sendMessage = async(req,res) => {
    try {
        const {message} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let chats = await Conversation.findOne({
            participants: {$all:[senderId,receiverId]}
        });

        if(!chats){
            chats = await Conversation.create({
                participants: [senderId,receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            conversationId: chats._id,
        });

        if(newMessage){
            chats.messages.push(newMessage._id);
        }

        await Promise.all([
            newMessage.save(),
            chats.save()
        ]);

        // Emit the new message in real-time to the receiver if they are online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json(newMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getMessages = async(req,res) => {
    try {
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        const chats = await Conversation.findOne({
            participants: {$all: [senderId,receiverId]},
        }).populate("messages");

        if(!chats){
            return res.status(200).json([]);
        }
        
        return res.status(200).json(chats.messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
};