import Conversation from "../Models/conversation.js";
import User from "../Models/userModels.js";

export const getUserbySearch = async(req,res) => {
    try {
        const search = req.query.search || "";
        const currentUserId = req.user._id;
        const users = await User.find({
            $and:[
                {
                    $or:[
                        {
                            username: {$regex:'.*'+search+'.*',$options:'i'}
                        },
                        {
                            fullname: {$regex:'.*'+search+'.*',$options:'i'}
                        }
                    ]
                },{
                    _id: {$ne:currentUserId}
                }
            ]
        }).select("-password").select("email");
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
} 

export const getCurrentChatters = async(req,res) => {
    try {
        const currentUserId = req.user._id;
        const currentChatters = await Conversation.find({
            participants: currentUserId
        }).sort({updatedAt: -1});
        if(!currentChatters || currentChatters.length === 0){
            return res.status(200).json([]);
        }
        const participantsIds = currentChatters.reduce((ids,conversation) => {
                const otherParticipants = conversation.participants.filter(id => id!== currentUserId)
                return [...ids, ...otherParticipants]
        },[])
        const otherParticipantsIds = participantsIds.filter(id => id.toString() !== currentUserId.toString());
        const user = await User.find({
            _id:{$in:otherParticipantsIds}
        }).select("-password").select("-email");

        const users = otherParticipantsIds.map(id => user.find(u => u._id.toString() === id.toString()));
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}
    