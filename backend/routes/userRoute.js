import express from "express";
import { getUserbySearch } from "../Controllers/userHandlerController.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.get('/search',isLogin,getUserbySearch);

export default router;