import express from "express";
import dotenv from "dotenv";
import dbconnect from "./DB/dbconnection.js";
import authRoutes from "./routes/authuser.js";

const app = express();
dotenv.config();

app.use(express.json());


app.use('/api/auth',authRoutes);




app.get("/", (req,res) => {
  res.send("Hello World");
})

app.listen(process.env.PORT, () => {
  dbconnect();
  console.log(`Server is running on port ${process.env.PORT}`);  
})