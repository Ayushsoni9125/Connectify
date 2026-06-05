
import User from "../Models/userModels.js";
import bcryptjs from "bcryptjs";
import jwtToken from "../utils/jwtwebToken.js";

export const userRegister = async (req,res)=>{
    try {

        const { fullname, username, email, password, gender, profilepic } = req.body;

        // Check if username OR email is already taken (separately)
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if(existingUser){
            if(existingUser.username === username){
                return res.status(400).json({message: "Username is already taken. Please choose another."});
            }
            return res.status(400).json({message: "Email is already registered. Please log in."});
        }

        const hashPassword = bcryptjs.hashSync(password, 10);
        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const Newuser = await User.create({
            fullname,
            username,
            email,
            password: hashPassword,
            gender,
            profilepic: gender === "male" ? profileBoy : profileGirl
        });
        if(Newuser){
            jwtToken(Newuser._id, res);
        }
        return res.status(201).json({message: "User created successfully", user: Newuser});
        
    } catch (error) {
        console.log(error);
        // Handle MongoDB duplicate key errors gracefully
        if(error.code === 11000){
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({message: `${field === "username" ? "Username" : "Email"} is already in use.`});
        }
        res.status(500).json({message: "Internal server error"});
    }
}
export const userLogin = async (req,res)=>{
    try {
            const { email, password } = req.body;
            const user = await User.findOne({email});
            if(!user){
                return res.status(404).json({message: "User not found"});
            }
            const isPasswordValid = bcryptjs.compareSync(password,user.password);
            if(!isPasswordValid){
                return res.status(401).json({message: "Invalid email or password"});
            }
            jwtToken(user._id,res);
            return res.status(200).json({message: "User logged in successfully",user});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}
export const userLogout = (req,res)=>{
    try {
        res.clearCookie("jwt");
        return res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}