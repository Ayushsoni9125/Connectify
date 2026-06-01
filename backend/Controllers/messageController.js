import Conversation from "../Models/conversation.js";
import Message from "../Models/message.js";

export const sendMessage = async(req,res) => {
    try {
        const {message} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let chats = await Conversation.findOne({
            participants: {$all:[senderId,receiverId]}
        })

        if(!chats){
            chats = await Conversation.create({
                participants: [senderId,receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            conversationId: chats._id,
        })
        
       if(newMessage){
        chats.messages.push(newMessage._id)
        }

       await Promise.all([
        newMessage.save(),
        chats.save()
       ])

        return res.status(201).json(newMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}   