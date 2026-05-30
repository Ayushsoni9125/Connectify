import express from "express";
import dotenv from "dotenv";
import dbconnect from "./DB/dbconnection.js";

const app = express();
dotenv.config();




app.get("/", (req,res) => {
  res.send("Hello World");
})

app.listen(process.env.PORT, () => {
  dbconnect();
  console.log(`Server is running on port ${process.env.PORT}`);  
})