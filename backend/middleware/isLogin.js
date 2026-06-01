 import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

const isLogin = async ( req,res,next ) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message: "Unauthorized"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: "Unauthorized"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({message: "User Not Found "});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

export default isLogin;