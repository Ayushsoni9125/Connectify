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